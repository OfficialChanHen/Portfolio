type FooterProps = {
    className?: string;
}

export default function Footer({ className }: FooterProps) {
    return(
        <div className={`header border-t-2 flex flex-row justify-center items-center p-5 text-center ${className}`}>
            <span>"Looking at the stars always makes me dream, as simply as I dream over the black dots representing villages and towns on a map."<br/>  — Vincent Van Gogh</span>
        </div>
    )
}