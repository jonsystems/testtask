"use client";
import { useUser } from "@clerk/clerk-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { HomeIcon, LoginIcon, PostsIcon } from "../svg/sidebar";
import SidebarOption from "./sidebar-option";

export default () => {
	const pathname = usePathname();
	const { isSignedIn, user } = useUser();

	return (
		<div className="flex flex-col justify-between p-4 h-screen w-72 border border-r border-solid">
			<div className="flex flex-col gap-y-1">
				<SidebarOption href={"/"}>
					<HomeIcon className={pathname === "/" ? "stroke-indigo-500" : "stroke-gray-700"} />
					<div className="text-base">Home</div>
				</SidebarOption>
				{isSignedIn && (
					<SidebarOption href={"/my-posts"}>
						<PostsIcon className={pathname === "/my-posts" ? "stroke-indigo-500" : "stroke-gray-700"} />
						<div className="text-base">My Posts</div>
					</SidebarOption>
				)}
				{!isSignedIn && (
					<SidebarOption href={"/sign-in"}>
						<LoginIcon className={["/sign-in", "/sign-up"].includes(pathname) ? "stroke-indigo-500" : "stroke-gray-700"} />
						<div className="text-base">Log In</div>
					</SidebarOption>
				)}
			</div>
			{isSignedIn && (
				<div className="flex flex-col">
					<SidebarOption href={"/profile"}>
						<Image className="rounded-full" src={user.imageUrl} alt={"Profile"} width={30} height={30} />
						<div className="text-base">{user.fullName}</div>
					</SidebarOption>
				</div>
			)}
		</div>
	)
};