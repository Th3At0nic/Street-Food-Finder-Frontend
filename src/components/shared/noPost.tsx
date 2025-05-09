import { FcEmptyTrash } from "react-icons/fc";
type NoPostProps = {
    h: string;
    w: string;
    title:string
  };
const NoPost = ({ h, w,title }: NoPostProps) => {
  return (
    <div className="">
      <div className="flex flex-col items-center justify-center py-20 text-center text-gray-600">
        <FcEmptyTrash className={`${h} ${w}`} />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          {title}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          When posts are created, they’ll show up here.
        </p>
      </div>
    </div>
  );
};

export default NoPost;
