import SearchField from "@/components/clientSideComponents/creator/searchField";
import "./creator.css";
import StoriesContainer from "@/components/clientSideComponents/creator/storiesContainer";

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
