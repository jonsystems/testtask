"use client";
import { useUser } from "@clerk/clerk-react";
import Image from "next/image";
import SidebarOption from "./sidebar-option";

export default () => {
	const { isSignedIn, user } = useUser();

	return (
		<div className="flex flex-col justify-between p-4 h-screen w-72 border border-r border-solid">
			<div className="flex flex-col gap-y-1">
				<SidebarOption href={"/"}>
					<Image src={"/img/sidebar/home.svg"} alt={"Home"} width={20} height={20} />
					<div className="text-base">Home</div>
				</SidebarOption>
				{isSignedIn && (
					<SidebarOption href={"/my-posts"}>
						<Image src={"/img/sidebar/posts.svg"} alt={"Home"} width={20} height={20} />
						<div className="text-base">My Posts</div>
					</SidebarOption>
				)}
				{!isSignedIn && (
					<SidebarOption href={"/sign-in"}>
						<Image src={"/img/sidebar/login.svg"} alt={"Home"} width={20} height={20} />
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