import { HospitalNavbar } from "@/components/hospital/Navbar/navbar";


export default async function HostpialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <><div className="h-20">

      <HospitalNavbar />
    </div>
      <div className="mx-auto  w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </>
  );
}
