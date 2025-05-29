"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Edit, HeartPulse } from "lucide-react";
import { useState, useEffect, useActionState, startTransition } from "react";
import { format, addDays } from "date-fns";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { toast } from "sonner";
import { Edit_Hospital_Request } from "@/actions/Hospital/new_request_all_action/Edit_request";

const formSchema = z.object({
  bloodType: z.enum([
    "A_POSITIVE",
    "A_NEGATIVE",
    "B_POSITIVE",
    "B_NEGATIVE",
    "AB_POSITIVE",
    "AB_NEGATIVE",
    "O_POSITIVE",
    "O_NEGATIVE",
  ]),
  unitsRequired: z.number().min(1).max(100),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH"]),
  token: z.string().optional(),
  requestId: z.string().optional(),
  expiryTime: z.string().refine(
    (val) => {
      try {
        const date = new Date(val);
        return !isNaN(date.getTime()) && date > new Date();
      } catch {
        return false;
      }
    },
    {
      message: "Expiry time must be a valid future date",
    }
  ),
});

interface NewRequestDialogProps {
  request: {
    bloodType?:
      | "A_POSITIVE"
      | "A_NEGATIVE"
      | "B_POSITIVE"
      | "B_NEGATIVE"
      | "AB_POSITIVE"
      | "AB_NEGATIVE"
      | "O_POSITIVE"
      | "O_NEGATIVE";
    unitsRequired?: number;
    urgency?: "LOW" | "MEDIUM" | "HIGH";
    expiryTime?: string;
    id?: string;
  }; // Adjust type as needed
}

export function Edit_RequestDialog({ request }: NewRequestDialogProps) {
  const [open, setOpen] = useState(false);
  const [minExpiryDate, setMinExpiryDate] = useState("");
  const [state, formAction, isPending] = useActionState(
    Edit_Hospital_Request,
    null
  );
  const session = useAuthStore();

  //! Effect to handle form submission state
  useEffect(() => {
    if (state?.status === 200) {
      toast.success(state.message);
      setOpen(false);
    }
    if (state?.status === 400) {
      toast.error(state.message);
      setOpen(false);
    }
    if (state?.status === 500) {
      toast.error(state.message);
      setOpen(false);
    }
  }, [state]);

  const formatExpiryForInput = (isoString: string | undefined) => {
    if (!isoString) {
      // Default to 1 hour from now if no expiry time provided
      const defaultDate = new Date();
      defaultDate.setHours(defaultDate.getHours() + 1);
      return format(defaultDate, "yyyy-MM-dd'T'HH:mm");
    }

    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) throw new Error("Invalid date");

      // Convert to local time string for datetime-local input
      const offset = date.getTimezoneOffset() * 60000;
      const localISOTime = new Date(date.getTime() - offset).toISOString();
      return localISOTime.slice(0, 16);
    } catch {
      // Fallback to current time + 1 hour if parsing fails
      const fallbackDate = new Date();
      fallbackDate.setHours(fallbackDate.getHours() + 1);
      return format(fallbackDate, "yyyy-MM-dd'T'HH:mm");
    }
  };

  console.log(request);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bloodType: request?.bloodType,
      unitsRequired: request?.unitsRequired,
      urgency: request?.urgency,
      token: session.session?.token,
      requestId: request?.id,
      expiryTime: formatExpiryForInput(request?.expiryTime),
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    const expiryDate = new Date(values.expiryTime);
    if (isNaN(expiryDate.getTime())) {
      throw new Error("Invalid expiry date");
    }
    const submissionValues = {
      ...values,
      expiryTime: expiryDate.toISOString(), // Ensure expiryTime is in ISO format
    };

    startTransition(async () => {
      await formAction(submissionValues);
    });

    form.reset();

    return;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start text-left">
          <Edit className="mr-2 h-4 w-4" /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-background rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <HeartPulse className="text-red-600" />
            Edit Blood Donation Request
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Other form fields remain the same */}
              <FormField
                control={form.control}
                name="bloodType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Blood Type
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-muted">
                          <SelectValue placeholder="Select blood type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background  border-border">
                        <SelectItem
                          value="A_POSITIVE"
                          className="hover:bg-red-50 hover:text-black"
                        >
                          A+
                        </SelectItem>
                        <SelectItem
                          value="A_NEGATIVE"
                          className="hover:bg-red-50 hover:text-black"
                        >
                          A-
                        </SelectItem>
                        <SelectItem
                          value="B_POSITIVE"
                          className="hover:bg-red-50 hover:text-black"
                        >
                          B+
                        </SelectItem>
                        <SelectItem
                          value="B_NEGATIVE"
                          className="hover:bg-red-50 hover:text-black"
                        >
                          B-
                        </SelectItem>
                        <SelectItem
                          value="AB_POSITIVE"
                          className="hover:bg-red-50 hover:text-black"
                        >
                          AB+
                        </SelectItem>
                        <SelectItem
                          value="AB_NEGATIVE"
                          className="hover:bg-red-50 hover:text-black"
                        >
                          AB-
                        </SelectItem>
                        <SelectItem
                          value="O_POSITIVE"
                          className="hover:bg-red-50 hover:text-black"
                        >
                          O+
                        </SelectItem>
                        <SelectItem
                          value="O_NEGATIVE"
                          className="hover:bg-red-50 hover:text-black"
                        >
                          O-
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unitsRequired"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Units Required
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        className="bg-muted border-border"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="urgency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Urgency Level
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-muted">
                          <SelectValue placeholder="Select urgency level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background border-border">
                        <SelectItem
                          value="LOW"
                          className="hover:bg-green-50 hover:text-black"
                        >
                          Low
                        </SelectItem>
                        <SelectItem
                          value="MEDIUM"
                          className="hover:bg-yellow-50 hover:text-black"
                        >
                          Medium
                        </SelectItem>
                        <SelectItem
                          value="HIGH"
                          className="hover:bg-red-50 hover:text-black"
                        >
                          High
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiryTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date & Time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        min={format(new Date(), "yyyy-MM-dd'T'HH:mm")} // Current time as min
                        {...field}
                        onChange={(e) => {
                          const selectedDate = new Date(e.target.value);
                          const now = new Date();

                          if (selectedDate <= now) {
                            form.setError("expiryTime", {
                              type: "manual",
                              message: "Expiry time must be in the future",
                            });
                          } else {
                            form.clearErrors("expiryTime");
                            field.onChange(e.target.value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                className="border-border text-foreground hover:bg-muted"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white"
                disabled={isPending}
              >
                {isPending ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
