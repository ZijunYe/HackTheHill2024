import Image from "next/image";

import RoadAnimation from "../components/roadAnimation";
import IconLinks from "../component/listIcons";

export default function RoadMap() {
  return (
    <div className="flex flex-row min-h-screen">
      <RoadAnimation></RoadAnimation>
      <IconLinks></IconLinks>
    </div>
  );
}
