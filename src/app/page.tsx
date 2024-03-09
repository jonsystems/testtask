import Posts from "./_components/index/posts";
import CreatePost from "./_components/posts/create-post";

export default () => {
	return (
		<div className="flex flex-col gap-y-3 w-full">
			<CreatePost />
			<Posts />
		</div>
	)
};