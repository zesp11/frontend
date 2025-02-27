import SearchField from "@/components/clientComponents/searchField";
import "./creator.css";
import StoriesContainer from "@/components/clientComponents/storiesContainer";

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
