
import DoubleContainerGradientQna from "../containers/HomePage/DoubleContainerGradientQna"
import MainHomeSection from "../containers/HomePage/MainHomeSection"
import TestimonialSection from "../containers/HomePage/TestimonialSection"

function Home() {
    return (
        <div className="bg-black">
          
            <MainHomeSection />

            <TestimonialSection />

           

            <DoubleContainerGradientQna /> 
        </div>
    )
}

export default Home
