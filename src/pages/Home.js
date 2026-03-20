// Home.js
import Navbar from '../components/Navbar';
import Section1 from '../components/section1'
import Section2 from '../components/section2'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <Section1 />
      <Section2 />

    </div>
  );
}