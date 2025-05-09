  "use client";

  import { useForm } from "react-hook-form";
  import { startTransition, useActionState, useEffect, useState } from "react";
  import { zodResolver } from "@hookform/resolvers/zod";
  import * as z from "zod";

  import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
  import { Input } from "@/components/ui/input";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { Button } from "@/components/ui/button";
  import { MapPin, Loader2, CheckCircle2 } from "lucide-react";
  import dynamic from "next/dynamic";
  import { BloodType, formSchema } from "./schema";
  import { toast } from "sonner";


  import { useRouter } from "next/navigation";
  import { useAuthStore } from "@/lib/stores/useAuthStore";
  import { Card } from "@/components/ui/card";

  const LocationPicker = dynamic(
    () => import("@/components/CommanComponents/location-picker"),
    {
      ssr: false,
      loading: () => (
        <div className="h-[300px] bg-gray-100 rounded-lg animate-pulse" />
      ),
    }
  );

  interface DonorProfileFormProps {
    isGeolocating: boolean;
    setIsGeolocating: (value: boolean) => void;
    formAction: (formData: FormData) => Promise<any>;
  }

  export default function DonorProfileForm({
    isGeolocating,
    setIsGeolocating,
    formAction,
  }: DonorProfileFormProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [state, formActionWithState,isPending] = useActionState(formAction, null);
    const router = useRouter();
    const { session } = useAuthStore();
    const [locationState, setLocationState] = useState({
      lat: 28.6139,
      lng: 77.209,
      address: "",
    });
    

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: "",
        age: 18,
        address: "",
        bloodType: undefined,
        location: { lat: 28.6139, lng: 77.209 },
        isAvailable: true,
        phone: session?.user?.phone || "",
        emergencyContact: "",
      },
    });

    // Sync location state with form
    useEffect(() => {
      if (locationState.address) {
        form.setValue("address", locationState.address, { shouldValidate: true });
      }
      form.setValue(
        "location",
        { lat: locationState.lat, lng: locationState.lng },
        { shouldValidate: true }
      );
    }, [locationState, form]);

    // Handle server response
    useEffect(() => {
      if (state) {
        

        if (state.success) {
          toast.success("Profile saved successfully!", {
            icon: <CheckCircle2 className="text-green-500" />,
          });
          router.push("/donor/dashboard");
        }
        if (!state.success && state.error) {
          toast.error(state.error, {
            icon: <Loader2 className="text-red-500" />,
          });
        }
      }
    }, [state, form, router]);

    // Auto-detect location
    const handleDetectLocation = () => {
      setIsGeolocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: locationState.address, // Preserve existing address if any
          };
          setLocationState(newLocation);
          setIsGeolocating(false);
          toast.success("Location detected successfully");
        },
        (error) => {
          toast.error("Could not detect your location. Please select manually.");
          setIsGeolocating(false);
        }
      );
    };
    useEffect(() => {
      if (locationState.address) {
        form.setValue("address", locationState.address, { shouldValidate: true });
      }
      form.setValue(
        "location",
        {
          lat: locationState.lat,
          lng: locationState.lng,
        },
        { shouldValidate: true }
      );
    }, [locationState, form]);

    // Handle form submission
    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (key === "location") {
          formData.append("location[lat]", value.lat.toString());
          formData.append("location[lng]", value.lng.toString());
        } else {
          formData.append(key, value?.toString() ?? "");
        }
      });

      if (session?.token) {
        formData.append("token", session?.token);
      }

      startTransition(() => {
        formActionWithState(formData);
      });
      return;
    };

    // Handle step navigation with validation
    const handleNextStep = async () => {
      const fields =
        currentStep === 1
          ? ["name", "age", "phone", "emergencyContact"]
          : ["bloodType", "address", "location"];

      const isValid = await form.trigger(fields as any);
      if (isValid) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        toast.error("Please fill all required fields correctly");
      }
    };

    // Form field configurations
    const step1Fields = [
      {
        name: "name",
        label: "Full Name",
        type: "text",
        placeholder: "John Doe",
        description: "As it appears on your ID",
      },
      {
        name: "age",
        label: "Age",
        type: "number",
        description: "Must be between 18-65 years",
        render: ({ field }: any) => (
          <Input
            type="number"
            min={18}
            max={65}
            {...field}
            onChange={(e) => field.onChange(parseInt(e.target.value))}
            className="bg-gray-50 border-gray-200 focus:ring-2 focus:ring-pink-500"
          />
        ),
      },
      {
        name: "phone",
        label: "Phone Number",
        type: "tel",
        placeholder: "+91xxxxxxxxxx",
        description: "We'll use this to contact you",
      },
      {
        name: "emergencyContact",
        label: "Emergency Contact",
        type: "text",
        placeholder: "Other phone number",
        description: "Who should we contact in case of emergency?",
      },
    ];

    const step2Fields = [
      {
        name: "bloodType",
        label: "Blood Type",
        type: "select",
        description: "Select your blood group",
        render: ({ field }: any) => (
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger className="bg-gray-50 border-gray-200 focus:ring-2 focus:ring-pink-500">
              <SelectValue placeholder="Select your blood type" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {Object.values(BloodType).map((type) => (
                <SelectItem
                  key={type}
                  value={type}
                  className="hover:bg-pink-50 focus:bg-pink-50"
                >
                  <div className="flex items-center">
                    <span className="font-medium">{type.replace("_", " ")}</span>
                    {type.includes("POSITIVE") && (
                      <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                        Most Needed
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ),
      },
      {
        name: "address",
        label: "Full Address",
        type: "textarea",
        placeholder: "Street, City, Postal Code",
        description: "Where can donors reach you?",
        props: { rows: 3 },
      },
      {
        name: "location",
        label: "Pin Your Location",
        type: "custom",
        description: "Drag the pin to adjust your exact location",
        render: ({ field }: any) => (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {field.label}
              </FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDetectLocation}
                disabled={isGeolocating}
                className="text-xs"
              >
                {isGeolocating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Auto-detect"
                )}
              </Button>
            </div>
            <LocationPicker
              onLocationChange={(location) => {
                setLocationState({
                  lat: location.lat,
                  lng: location.lng,
                  address: location.address || "",
                });
              }}
              initialLocation={{
                lat: locationState.lat,
                lng: locationState.lng,
              }}
            />
          </div>
        ),
      },
    ];

    return (
      <div className="max-w-3xl mx-auto my-3">
        {/* Progress Bar */}
        <div className="h-2 bg-gray-100 mb-6 rounded-full">
          <div
            className="h-full bg-gradient-to-r from-red-400 to-pink-500 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            {/* Step Indicators */}
            <div className="flex justify-center gap-4 mb-8">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    currentStep >= step
                      ? "bg-pink-500 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                  onClick={() => currentStep > step && setCurrentStep(step)}
                >
                  {step}
                </div>
              ))}
            </div>

            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <Card className="p-3 md:p-6 space-y-1">
                <h2 className="text-xl font-bold text-gray-800">
                  Personal Information
                </h2>
                {step1Fields.map((field) => (
                  <FormField
                    key={field.name}
                    control={form.control}
                    name={field.name as keyof z.infer<typeof formSchema>}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          {field.label}
                        </FormLabel>
                        <FormControl>
                          {field.render ? (
                            field.render({ field: formField })
                          ) : (
                            <Input
                              type={field.type}
                              placeholder={field.placeholder}
                              {...formField}
                              className="bg-gray-50 border-gray-200 focus:ring-2 focus:ring-pink-500"
                            />
                          )}
                        </FormControl>
                        {field.description && (
                          <FormDescription className="text-gray-500 text-sm">
                            {field.description}
                          </FormDescription>
                        )}
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />
                ))}
              </Card>
            )}

            {/* Step 2: Medical Information */}
            {currentStep === 2 && (
              <Card className="p-3 md:p-6 space-y-1">
                <h2 className="text-xl font-bold text-gray-800">
                  Medical Information
                </h2>
                {step2Fields.map((field) => (
                  <FormField
                    key={field.name}
                    control={form.control}
                    name={field.name as keyof z.infer<typeof formSchema>}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          {field.label}
                        </FormLabel>
                        <FormControl>
                          {field.render ? (
                            field.render({ field: formField })
                          ) : field.type === "textarea" ? (
                            <Textarea
                              placeholder={field.placeholder}
                              {...formField}
                              className="bg-gray-50 border-gray-200 focus:ring-2 focus:ring-pink-500"
                              rows={field.props?.rows || 3}
                            />
                          ) : (
                            <Input
                              type={field.type}
                              placeholder={field.placeholder}
                              {...formField}
                              className="bg-gray-50 border-gray-200 focus:ring-2 focus:ring-pink-500"
                            />
                          )}
                        </FormControl>
                        {field.description && (
                          <FormDescription className="text-gray-500 text-sm">
                            {field.description}
                          </FormDescription>
                        )}
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />
                ))}
              </Card>
            )}

            {/* Step 3: Review and Availability */}
            {currentStep === 3 && (
              <Card className="p-6 space-y-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Review & Availability
                </h2>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-blue-800">Availability</h3>
                  <p className="text-blue-600 text-sm mt-1">
                    When are you typically available for donations?
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="isAvailable"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 bg-gray-50">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-5 w-5 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-gray-700 font-medium">
                          I'm currently available to donate
                        </FormLabel>
                        <FormDescription className="text-gray-500 text-sm">
                          You can change this anytime in your profile
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h3 className="font-medium text-green-800">
                    Review Your Information
                  </h3>
                  <p className="text-green-600 text-sm mt-1">
                    Please verify all details before submitting
                  </p>
                </div>

                {/* Summary of entered data */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700">Your Details:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(form.getValues()).map(([key, value]) => {
                      if (key === "location" || key === "isAvailable")
                        return null;
                      return (
                        <div key={key} className="bg-gray-50 p-3 rounded">
                          <p className="text-sm font-medium text-gray-500 capitalize">
                            {key.replace(/([A-Z])/g, " $1")}
                          </p>
                          <p className="text-gray-800">
                            {value?.toString() || (
                              <span className="text-gray-400">Not provided</span>
                            )}
                          </p>
                        </div>
                      );
                    })}
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm font-medium text-gray-500">
                        Location
                      </p>
                      <p className="text-gray-800">
                        {locationState.lat.toFixed(4)},{" "}
                        {locationState.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4 px-2">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="border-gray-300 cursor-pointer text-gray-700 hover:bg-gray-50 flex-1 sm:flex-none"
                >
                  Back
                </Button>
              ) : (
                <div className="flex-1" />
              )}

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-gradient-to-r from-red-500 cursor-pointer to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-md flex-1 sm:flex-none"
                >
                  Continue
                </Button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1"
                  >
                    Edit Information
                  </Button>
                  {/* <SubmitButton /> */}
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-gradient-to-r cursor-pointer from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-md flex-1"
                    aria-disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Complete Profile"
                    )}
                  </Button>
                </div>
              )}
            </div>
          </form>
        </Form>
      </div>
    );
  }
