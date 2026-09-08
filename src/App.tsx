import { ActivitiesGateway } from "./components/ActivitiesGateway";
import { ActivityBanner } from "./components/ActivityBanner";
import { ChallengeConnection } from "./components/ChallengeConnection";
import { Footer } from "./components/Footer";
import { Gallery } from "./components/Gallery";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Latest } from "./components/Latest";
import { MobileActionDock } from "./components/MobileActionDock";
import { PatonVoteGuide } from "./components/PatonVoteGuide";
import { ScrollToTopButton } from "./components/ScrollToTopButton";
import { Stories } from "./components/Stories";
import { Support } from "./components/Support";
import { TodayDashboard } from "./components/TodayDashboard";
import {
  HOME_GALLERY_LIMIT,
  HOME_NEWS_LIMIT,
  HOME_STORY_LIMIT,
} from "./lib/homePortal";

export default function App() {
  return (
    <div className="min-h-screen overflow-x-clip bg-paper pb-20 text-ink sm:pb-0">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-sage focus:px-4 focus:py-2 focus:text-white"
      >
        本文へスキップ
      </a>
      <ActivityBanner />
      <Header />
      <main id="main">
        <Hero />
        <PatonVoteGuide />
        <TodayDashboard />
        <Support />
        <ActivitiesGateway />
        <ChallengeConnection />
        <Latest limit={HOME_NEWS_LIMIT} />
        <Stories limit={HOME_STORY_LIMIT} />
        <Gallery limit={HOME_GALLERY_LIMIT} />
      </main>
      <Footer />
      <MobileActionDock />
      <ScrollToTopButton />
    </div>
  );
}
