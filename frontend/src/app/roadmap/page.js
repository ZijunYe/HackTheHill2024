
import RoadAnimation from "../components/roadAnimation";
import IconLinks from "../component/listIcons";
import Score from "../component/Score";

export default function RoadMap() {
  return (
    <div className="flex flex-row min-h-screen">
      <Score></Score>
      <RoadAnimation></RoadAnimation>
      <IconLinks></IconLinks>
    </div>
  );
}
