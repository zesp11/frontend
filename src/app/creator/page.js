import SearchField from "@/clientComponents/searchField";
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
