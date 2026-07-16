// Web re-authoring of the app's src/ui/SuitIcons.tsx.
// Path data copied 1:1 from react-native-svg; rendered as plain web SVG.
// No react-native-svg dependency.

type SuitIconProps = {
  size?: number;
  className?: string;
  title?: string;
};

function svgProps(size: number, className?: string, title?: string) {
  return {
    width: size,
    height: size,
    className,
    role: title ? ("img" as const) : ("presentation" as const),
    "aria-hidden": title ? undefined : true,
    "aria-label": title,
  };
}

export function ItalianSword({ size = 24, className, title }: SuitIconProps) {
  return (
    <svg {...svgProps(size, className, title)} viewBox="0 0 16 16">
      {title ? <title>{title}</title> : null}
      <path
        fill="currentColor"
        d="M16 0H13L3.70711 9.29289L2.20711 7.79289L0.792893 9.20711L3.08579 11.5L1.5835 13.0023C1.55586 13.0008 1.52802 13 1.5 13C0.671573 13 0 13.6716 0 14.5C0 15.3284 0.671573 16 1.5 16C2.32843 16 3 15.3284 3 14.5C3 14.472 2.99923 14.4441 2.99771 14.4165L4.5 12.9142L6.79289 15.2071L8.20711 13.7929L6.70711 12.2929L16 3V0Z"
      />
    </svg>
  );
}

export function ItalianCup({ size = 24, className, title }: SuitIconProps) {
  return (
    <svg {...svgProps(size, className, title)} viewBox="0 0 512 512">
      {title ? <title>{title}</title> : null}
      <g fill="currentColor">
        <path d="M21.595,0v72.602c0,21.02,2.801,41.904,8.325,62.07c12.268,44.777,37.404,84.6,72.689,115.161c32.178,27.871,70.781,46.239,112.334,53.571v96.112h82.114v-96.112c41.553-7.332,80.156-25.7,112.334-53.571c35.285-30.562,60.421-70.384,72.689-115.162c5.524-20.166,8.325-41.049,8.325-62.069V0H21.595z" />
        <path d="M352.658,429.936H159.343c-36.356,0-65.934,29.578-65.934,65.934V512h325.183v-16.13C418.592,459.514,389.015,429.936,352.658,429.936z" />
      </g>
    </svg>
  );
}

export function ItalianCoin({ size = 24, className, title }: SuitIconProps) {
  return (
    <svg {...svgProps(size, className, title)} viewBox="0 0 16 16">
      {title ? <title>{title}</title> : null}
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM9 5H7V11H9V5Z"
      />
    </svg>
  );
}

export function ItalianBat({ size = 24, className, title }: SuitIconProps) {
  return (
    <svg {...svgProps(size, className, title)} viewBox="-0.01 0 41.877 41.877">
      {title ? <title>{title}</title> : null}
      <path
        fill="currentColor"
        transform="translate(-44.001 -233.123)"
        d="M84.9,242.457l.108.109-.376.333a2.983,2.983,0,0,1-.325.405,18.649,18.649,0,0,1-1.766,1.422c-2.741,2.373-7.3,6.236-11.245,9.185-8.819,6.59-7.6,4.816-13.81,9.907a60.474,60.474,0,0,0-8.4,8.218c.844,1.177,1.16,2.285.7,2.749-.614.614-2.357-.135-3.894-1.672s-2.286-3.281-1.672-3.894c.407-.407,1.312-.2,2.323.423a66.746,66.746,0,0,0,7.671-7.987c5.145-6.246,3.979-4.578,10.056-13.86a63.743,63.743,0,0,1,10.3-11.548,10.5,10.5,0,0,1,1.126-1.563c1.389-1.389,6.444-2.585,8.824-.2C86.538,236.507,85.969,240.467,84.9,242.457Z"
      />
    </svg>
  );
}

export function FrenchSpade({ size = 24, className, title }: SuitIconProps) {
  return (
    <svg {...svgProps(size, className, title)} viewBox="0 0 16 16">
      {title ? <title>{title}</title> : null}
      <path
        fill="currentColor"
        d="M8 0L1.03553 6.96447C0.372492 7.62751 0 8.52678 0 9.46447V9.54584C0 11.4535 1.54648 13 3.45416 13C4.1361 13 4.80278 12.7981 5.37019 12.4199L7.125 11.25L6 15V16H10V15L8.875 11.25L10.6298 12.4199C11.1972 12.7981 11.8639 13 12.5458 13C14.4535 13 16 11.4535 16 9.54584V9.46447C16 8.52678 15.6275 7.62751 14.9645 6.96447L8 0Z"
      />
    </svg>
  );
}

export function FrenchHeart({ size = 24, className, title }: SuitIconProps) {
  return (
    <svg {...svgProps(size, className, title)} viewBox="0 0 16 16">
      {title ? <title>{title}</title> : null}
      <path
        fill="currentColor"
        d="M1.24264 8.24264L8 15L14.7574 8.24264C15.553 7.44699 16 6.36786 16 5.24264V5.05234C16 2.8143 14.1857 1 11.9477 1C10.7166 1 9.55233 1.55959 8.78331 2.52086L8 3.5L7.21669 2.52086C6.44767 1.55959 5.28338 1 4.05234 1C1.8143 1 0 2.8143 0 5.05234V5.24264C0 6.36786 0.44699 7.44699 1.24264 8.24264Z"
      />
    </svg>
  );
}

export function FrenchDiamond({ size = 24, className, title }: SuitIconProps) {
  return (
    <svg {...svgProps(size, className, title)} viewBox="0 0 512 512">
      {title ? <title>{title}</title> : null}
      <polygon fill="currentColor" points="256,0 72.115,256 256,512 439.885,256" />
    </svg>
  );
}

export function FrenchClub({ size = 24, className, title }: SuitIconProps) {
  return (
    <svg {...svgProps(size, className, title)} viewBox="0 0 16 16">
      {title ? <title>{title}</title> : null}
      <path
        fill="currentColor"
        d="M12 4C12 4.25656 11.9758 4.50748 11.9297 4.75061C11.9531 4.75021 11.9765 4.75 12 4.75C14.2091 4.75 16 6.54086 16 8.75C16 10.9591 14.2091 12.75 12 12.75C10.7347 12.75 9.60658 12.1625 8.87361 11.2454L10 15V16H6V15L7.12639 11.2454C6.39342 12.1625 5.26532 12.75 4 12.75C1.79086 12.75 0 10.9591 0 8.75C0 6.54086 1.79086 4.75 4 4.75C4.02349 4.75 4.04692 4.7502 4.07031 4.75061C4.02415 4.50748 4 4.25656 4 4C4 1.79086 5.79086 0 8 0C10.2091 0 12 1.79086 12 4Z"
      />
    </svg>
  );
}
