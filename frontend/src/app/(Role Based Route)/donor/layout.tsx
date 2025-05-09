import { MobileNavbar } from "@/components/donor/Navbar/mobile-navbar";
import { Navbar } from "@/components/donor/Navbar/navbar";



export default async function DonorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  

  return (
    <>
      
        <Navbar />
        
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </>
  );
}