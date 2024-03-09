export const UpvoteIcon = ({ className }: { className: string }) => {
  return <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.33325 11.6668L9.99992 5.00012L16.6666 11.6668M6.66659 14.1666L9.99992 10.8333L13.3333 14.1666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
};

export const DownvoteIcon = ({ className }: { className: string }) => {
  return <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.3333 5.83345L9.99992 9.16678L6.66659 5.83345M3.33325 8.33345L9.99992 15.0001L16.6666 8.33345" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
};

export const CommentReply = () => {
  return <svg className="stroke-gray-700" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.33301 7.33347C1.33301 6.40446 1.33301 5.93996 1.39457 5.55129C1.73342 3.41183 3.41137 1.73388 5.55084 1.39502C5.9395 1.33347 6.404 1.33347 7.33301 1.33347H7.99968C9.54963 1.33347 10.3246 1.33347 10.9604 1.50384C12.6859 1.96617 14.0336 3.31391 14.496 5.03937C14.6663 5.6752 14.6663 6.45018 14.6663 8.00013V12.7807C14.6663 13.9041 13.4407 14.5981 12.4773 14.0201V14.0201C11.7285 13.5708 10.8717 13.3335 9.99852 13.3335H7.33301C6.404 13.3335 5.9395 13.3335 5.55084 13.2719C3.41137 12.9331 1.73342 11.2551 1.39457 9.11564C1.33301 8.72697 1.33301 8.26247 1.33301 7.33347V7.33347Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
};