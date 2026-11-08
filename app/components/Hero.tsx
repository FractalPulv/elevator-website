import { CardFan } from "@/app/components/CardFan";
import { PhoneMockup } from "@/app/components/PhoneMockup";
import { Reveal } from "@/app/components/Reveal";
import { StoreButtons } from "@/app/components/StoreButtons";

export function Hero() {
  return (
    <div className="mx-auto grid w-full max-w-5xl items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-2">
      <Reveal>
        <p className="hero-kicker">For the Italian card game Ascensore</p>
        <h1 className="display hero-title mt-6 text-[2.75rem] sm:text-[3.5rem] lg:text-[3.4rem]">
          Score Elevator
          <br />
          without{" "}
          <span className="accent-text whitespace-nowrap">pen and paper</span>
        </h1>
        <p className="lede hero-lede mt-6 max-w-[29rem]">
          One phone keeps score for the whole table. Each prediction is locked
          in the moment it&rsquo;s said, so nobody can change their call later,
          and the app adds up every round.
        </p>
        <div className="hero-cta mt-9">
          <StoreButtons />
          <span className="hero-cta__note">Free for 3 to 4 players</span>
        </div>
      </Reveal>

      {/* the pair of phones, with the hand just dealt peeking out from under them */}
      <Reveal delay={0.1}>
        <div className="relative flex h-[30rem] items-center justify-center sm:h-[36rem]">
          <div className="absolute left-[8%] top-0 z-10 hidden sm:block">
            <PhoneMockup
              src="/screenshots/home-light.jpg"
              alt="Games screen in light mode"
              tilt="left"
              width="14rem"
            />
          </div>
          <CardFan className="absolute bottom-[14%] right-[-2%] z-0 hidden rotate-[18deg] sm:block" />
          <div className="relative z-10 sm:ml-[34%] sm:mt-20">
            <PhoneMockup
              src="/screenshots/chart-portrait.jpg"
              alt="Score chart and podium after five rounds"
              tilt="left"
              width="15.5rem"
              glow
              priority
            />
          </div>
        </div>
      </Reveal>
    </div>
  );
}
