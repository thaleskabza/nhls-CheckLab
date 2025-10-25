import "../globals.css";
import "@ui/theme/nhls.css";
export default function Root({ children }:{children:React.ReactNode}) {
  return <html lang="en"><body><header className="p-4 border-b bg-white"><h1 className="text-xl font-semibold">NHLS Admin</h1></header><main className="p-6">{children}</main></body></html>
}
