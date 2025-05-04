import { cn } from "@/lib/utils";
import { Input } from "../input";


type TImageUploaderProps = {
  imageFiles: File[] | [];
  setImageFiles: React.Dispatch<React.SetStateAction<File[] | []>>;
  setImagePreview: React.Dispatch<React.SetStateAction<string[] | []>>;
  label?: string;
  className?:string
};
const StreetImageUploader = ({
  setImageFiles,
  setImagePreview,
  label = "upload Images",
  className,
}: TImageUploaderProps) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    setImageFiles((prev) => [...prev, file]);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };
  return (
    <div className={cn("flex flex-col items-center w-full gap-4",className)}>
      <Input
        onChange={handleImageChange}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        id="image-uploader"
      ></Input>
      <label
        htmlFor="image-uploader"
        className="w-full h-36 md:size-36 flex items-center justify-center border-2 border-dashed broder-gray-300 rounded-md cursor-pointer text-center text-sm text-gray-500 hover:bg-white transition"
      >
        {label}
      </label>
    </div>
  );
};

export default StreetImageUploader;
