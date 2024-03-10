import { SignIn } from "@clerk/nextjs";

export default () => {
  return (
    <div className="flex justify-center items-center w-full">
      <SignIn
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