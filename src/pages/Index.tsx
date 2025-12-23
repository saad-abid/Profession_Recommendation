import { Link } from "react-router-dom";
import Header from "@/components/Header";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold font-display text-foreground">Welcome to Profile Manager</h1>
          <p className="text-xl text-muted-foreground mb-8">Search professionals and get AI-powered recommendations</p>
          <Link 
            to="/search"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
