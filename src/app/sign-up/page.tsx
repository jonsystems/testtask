import { SignUp } from "@clerk/nextjs";

export default () => {
  return (
    <div className="flex justify-center items-center w-full">
      <SignUp
        appearance={{
          elements: {
            card: "shadow-none",
            socialButtonsBlockButton: "rounded-xl",
            footerActionText: "text-gray-700",
            footerActionLink: "text-[#172554] font-medium"
          }
        }}
      />
    </div>
  )
};