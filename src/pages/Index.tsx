
import { ArrowRight, Download, Monitor, Youtube, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import HoneygainLogo from "@/components/HoneygainLogo";
import { Separator } from "@/components/ui/separator";
import { FaWindows, FaPlay  } from "react-icons/fa";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-honeygain-background">
      {/* Hero Section */}
      <header className="pt-16 pb-12 px-4 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-center mb-6">
            <HoneygainLogo className="w-16 h-16" />
            <h1 className="text-3xl md:text-5xl font-bold text-white ml-4">HoneyGain Legit Farm</h1>
          </div>
          <p className="text-lg md:text-xl text-honeygain-muted mt-4 mb-8">
            Automate your passive income with our powerful Honeygain automation suite, 
            designed exclusively for Windows users
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button variant="ghost" size="lg" asChild>
              <Link to="/dashboard">
                Get Started <FaPlay className="ml-2" />
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/15"
            >
              <FaWindows className="mr-2" /> Windows Only
            </Button>

          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-12 px-4 bg-honeygain-card">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">Free Plan Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* YouTube Downloader Feature */}
            <Card className="bg-honeygain-card border-honeygain/20">
              <CardHeader>
                <Youtube className="text-honeygain h-12 w-12 mb-2" />
                <CardTitle className="text-white">YouTube Downloader</CardTitle>
                <CardDescription className="text-honeygain-muted">
                  Automatic video downloading
                </CardDescription>
              </CardHeader>
              <CardContent className="text-honeygain-muted">
                <p>Download YouTube videos automatically while earning passive income. Our tool handles everything for you.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Download className="mr-2" /> Free Access
                </Button>
              </CardFooter>
            </Card>

            {/* ClaimPot Feature */}
            <Card className="bg-honeygain-card border-honeygain/20">
              <CardHeader>
                <Gift className="text-honeygain h-12 w-12 mb-2" />
                <CardTitle className="text-white">ClaimPot Automation</CardTitle>
                <CardDescription className="text-honeygain-muted">
                  Never miss a daily reward
                </CardDescription>
              </CardHeader>
              <CardContent className="text-honeygain-muted">
                <p>Automatically claim your daily rewards from the Honeygain Lucky Pot. Set it and forget it.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Gift className="mr-2" /> Free Access
                </Button>
              </CardFooter>
            </Card>

            {/* Dashboard Feature */}
            <Card className="bg-honeygain-card border-honeygain/20">
              <CardHeader>
                <HoneygainLogo className="h-12 w-12 mb-2" />
                <CardTitle className="text-white">Real-time Dashboard</CardTitle>
                <CardDescription className="text-honeygain-muted">
                  Monitor your earnings
                </CardDescription>
              </CardHeader>
              <CardContent className="text-honeygain-muted">
                <p>Track your Honeygain earnings and automation status in real-time with our intuitive dashboard.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <ArrowRight className="mr-2" /> Free Access
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 px-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">Why Choose Our Automator</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <Monitor className="text-honeygain mr-4 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-medium text-white">Windows Optimized</h3>
                <p className="text-honeygain-muted mt-2">Our application is specifically designed for Windows systems, ensuring maximum compatibility and performance.</p>
              </div>
            </div>
            
            <Separator className="bg-honeygain-card" />
            
            <div className="flex items-start">
              <Youtube className="text-honeygain mr-4 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-medium text-white">Automated YouTube Downloads</h3>
                <p className="text-honeygain-muted mt-2">Set up a list of videos to download automatically, helping you generate more traffic and earnings.</p>
              </div>
            </div>
            
            <Separator className="bg-honeygain-card" />
            
            <div className="flex items-start">
              <Gift className="text-honeygain mr-4 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-medium text-white">Never Miss ClaimPot</h3>
                <p className="text-honeygain-muted mt-2">Automatically claim your daily rewards without having to remember or manually log in every day.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button size="lg" asChild>
              <Link to="/dashboard">Start Automating Now <ArrowRight className="ml-2" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-honeygain-card mt-auto">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <HoneygainLogo className="w-10 h-10" />
            <p className="text-honeygain-muted ml-2">HoneyGain Legit Farm 2025</p>
          </div>
          <p className="text-honeygain-muted text-sm text-center md:text-right">
            Not affiliated with Honeygain. For Windows users only.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;