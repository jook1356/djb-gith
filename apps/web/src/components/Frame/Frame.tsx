import styles from './Frame.module.scss';

function Frame({ children, ...props }: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={`${styles.frame} ${props.className}`}>
      {children}
    </div>
  );
}

export default Frame;