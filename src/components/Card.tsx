import { h, FunctionalComponent } from 'preact';

export interface CardProps {
  title: string;
  subtitle?: string;
  icon?: string;
  color?: 'default' | 'orange' | 'blue' | 'purple' | 'green' | 'pink';
  onClick?: () => void;
  children?: any;
  className?: string;
}

export const Card: FunctionalComponent<CardProps> = ({
  title,
  subtitle,
  icon,
  color = 'default',
  onClick,
  children,
  className = ''
}) => {
  const clickable = !!onClick;
  
  return (
    <div 
      class={`card card-${color} ${clickable ? 'clickable' : ''} ${className}`}
      onClick={onClick}
    >
      {icon && <span class="card-icon">{icon}</span>}
      <h3 class="card-title">{title}</h3>
      {subtitle && <p class="card-subtitle">{subtitle}</p>}
      {children}
    </div>
  );
};

export interface CardGridProps {
  children: any;
  columns?: 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CardGrid: FunctionalComponent<CardGridProps> = ({
  children,
  columns = 2,
  gap = 'md',
  className = ''
}) => {
  return (
    <div class={`card-grid cols-${columns} gap-${gap} ${className}`}>
      {children}
    </div>
  );
};
