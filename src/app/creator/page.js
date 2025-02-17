import SearchField from "@/components/creatorComponents/searchField";
import "./creator.css";
import StoriesContainer from "@/components/creatorComponents/storiesContainer";

export default function Creator() {
  return (
    <>
      <div className="creatorContainer">
        <SearchField />
        <StoriesContainer />
      </div>
    </>
  );
}
