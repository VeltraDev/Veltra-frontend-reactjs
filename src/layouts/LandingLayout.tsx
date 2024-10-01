import Footer from "../components/Footer";
import Header from "../components/Header";



export default function LandingLayout(props: { children: React.ReactNode }) {
  return (
    <div className="flex justify-start w-full bg-gray-100">
      
      <div id="content" className="w-full ">
        <Header />
        <div id="body" className="flex w-full overflow-auto h-4/5">
          {props.children}
        </div>
        <Footer />
      </div>
    </div>
  );
}