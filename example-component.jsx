import React from 'react';

// Simple Button component
export const Button = ({ children, onClick, variant = 'primary', ...props }) => {
  return (
    <button 
      className={`button button-${variant}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Card component that uses the Button
export const Card = ({ title, description, onAction }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3>{title}</h3>
      </div>
      <div className="card-body">
        <p>{description}</p>
      </div>
      <div className="card-footer">
        <Button onClick={onAction}>Learn More</Button>
      </div>
    </div>
  );
};

// Page component that uses multiple Cards
export const HomePage = () => {
  const handleCardAction = (id) => {
    console.log(`Card ${id} action clicked`);
  };
  
  return (
    <main className="home-page">
      <h1>Welcome to Our Site</h1>
      
      <div className="card-grid">
        <Card 
          title="Feature One" 
          description="Description of our first amazing feature."
          onAction={() => handleCardAction(1)}
        />
        
        <Card 
          title="Feature Two" 
          description="Description of our second amazing feature."
          onAction={() => handleCardAction(2)}
        />
        
        <Card 
          title="Feature Three" 
          description="Description of our third amazing feature."
          onAction={() => handleCardAction(3)}
        />
      </div>
    </main>
  );
};

// After transformation with the plugin, the HTML output in development would look like:
// <main data-in="HomePage" data-is="main" data-at="example-component.jsx:28-50" class="home-page">
//   <h1 data-in="HomePage" data-is="h1" data-at="example-component.jsx:29">Welcome to Our Site</h1>
//   
//   <div data-in="HomePage" data-is="div" data-at="example-component.jsx:31-49" class="card-grid">
//     <div data-in="Card" data-is="div" data-at="example-component.jsx:14-24" class="card">
//       <!-- Card contents with data attributes -->
//     </div>
//     <!-- More cards -->
//   </div>
// </main> 