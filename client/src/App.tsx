import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/hooks/use-theme";
import { LanguageProvider } from "@/contexts/language-context";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Browse from "@/pages/Browse";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Bookmarks from "@/pages/Bookmarks";
import NotFound from "@/pages/not-found";
import AnimatedLayout from "@/components/AnimatedLayout";
import SmoothScroll from "@/components/SmoothScroll";

function Router() {
  const [location] = useLocation();

  useEffect(() => {
    // Smooth scroll to top on route change
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [location]);

  return (
    <AnimatedLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/browse" component={Browse} />
        <Route path="/bookmarks" component={Bookmarks} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route component={NotFound} />
      </Switch>
    </AnimatedLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="gyangita-theme">
        <LanguageProvider>
          <SmoothScroll className="bg-background">
            <div className="min-h-screen flex flex-col relative">
              <Header />
              <main className="flex-grow relative z-10">
                <Router />
              </main>
              <Footer />
            </div>
            <Toaster />
          </SmoothScroll>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;