


export default async function HostpialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  

  return (
    <>
      
      <div className="mx-auto mt-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}  
      </div>
    </>
  );
}