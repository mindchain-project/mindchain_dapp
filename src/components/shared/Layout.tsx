import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import "@/styles/components.css";

const Layout = ({children }: { children: React.ReactNode }) => {

  return (
      <div
        className={`flex flex-col p-5 items-center min-h-screen`}>
      <Header />
        <main className="main-section">
          {children}
        </main>
      <Footer />
      </div>
  );
}

export default Layout;