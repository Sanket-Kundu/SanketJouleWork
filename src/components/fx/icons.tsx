import React, { useId, useState } from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

interface JouleIconProps extends IconProps {
  isHovered?: boolean;
}

const createIcon = (
  pathData: string,
  fillRule?: "evenodd" | "nonzero"
): React.FC<IconProps> => {
  const Icon: React.FC<IconProps> = ({ size = 20, className, ...props }) => (
    <svg
      viewBox="0 0 20 20"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d={pathData} fillRule={fillRule} />
    </svg>
  );
  return Icon;
};

// SAP icons use 512x512 viewBox
const createSapIcon = (
  pathData: string,
  fillRule?: "evenodd" | "nonzero"
): React.FC<IconProps> => {
  const Icon: React.FC<IconProps> = ({ size = 20, className, ...props }) => (
    <svg
      viewBox="0 0 512 512"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d={pathData} fillRule={fillRule} />
    </svg>
  );
  return Icon;
};

// Conversations icon - two overlapping chat bubbles with text lines
export const ConversationsIcon: React.FC<IconProps> = ({ size = 20, className, ...props }) => (
  <svg viewBox="0 0 20 20" width={size} height={size} fill="currentColor" className={className} {...props}>
    <path d="M14 3.5C14 3.22386 13.7761 3 13.5 3H2.5C2.22387 3 2.00001 3.22387 2 3.5V11.5C2 11.7761 2.22386 12 2.5 12H4C4.55223 12.0001 5 12.4478 5 13V13.5859L6.29297 12.293L6.36621 12.2266C6.54417 12.0807 6.76791 12 7 12H13.5C13.7761 12 14 11.7761 14 11.5V3.5ZM16 11.5C16 12.8807 14.8807 14 13.5 14H7.41406L4.70703 16.707C4.42103 16.993 3.99086 17.0786 3.61719 16.9238C3.24353 16.769 3 16.4045 3 16V14H2.5C1.11929 14 0 12.8807 0 11.5V3.5C1.10168e-05 2.1193 1.1193 1 2.5 1H13.5C14.8807 1 16 2.11929 16 3.5V11.5Z"/>
    <path d="M20 14.5V7C20 5.89543 19.1046 5 18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7V14.5C18 14.7761 17.7761 15 17.5 15H16C15.4478 15.0001 15 15.4478 15 16V16.5859L13.707 15.293L13.6338 15.2266C13.4558 15.0807 13.2321 15 13 15H8C7.44771 15 7 15.4477 7 16C7 16.5523 7.44771 17 8 17H12.5859L15.293 19.707C15.579 19.993 16.0091 20.0786 16.3828 19.9238C16.7565 19.769 17 19.4045 17 19V17H17.5C18.8807 17 20 15.8807 20 14.5Z"/>
    <path d="M9.33301 5C9.88529 5 10.333 5.44772 10.333 6C10.333 6.55228 9.88529 7 9.33301 7H4C3.44772 7 3 6.55228 3 6C3 5.44772 3.44772 5 4 5H9.33301Z"/>
    <path d="M12 8C12.5521 8.00018 13 8.44782 13 9C13 9.55218 12.5521 9.99982 12 10H4C3.44772 10 3 9.55229 3 9C3 8.44772 3.44772 8 4 8H12Z"/>
  </svg>
);
ConversationsIcon.displayName = "ConversationsIcon";

// Discover icon - circle outline with compass needle
export const DiscoverIcon: React.FC<IconProps> = ({ size = 20, className, ...props }) => (
  <svg viewBox="0 0 20 20" width={size} height={size} fill="currentColor" className={className} {...props}>
    <path d="M7.11914 5.92285C7.07378 5.49215 7.56086 5.21098 7.91113 5.46582L12.1309 8.53613C12.2452 8.61928 12.319 8.74717 12.334 8.8877L12.8828 14.0781C12.9281 14.5086 12.442 14.7895 12.0918 14.5352L7.87109 11.4648C7.75685 11.3817 7.68295 11.2538 7.66797 11.1133L7.11914 5.92285Z"/>
    <path d="M10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0ZM10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2Z" fillRule="evenodd" clipRule="evenodd"/>
  </svg>
);
DiscoverIcon.displayName = "DiscoverIcon";

// Jobs icon - connected nodes/workflow
export const JobsIcon = createIcon(
  "M6.77487 6.94464C6.28776 6.2744 6 5.44677 6 4.55116C6 2.3169 7.79086 0.505676 10 0.505676C12.2091 0.505676 14 2.3169 14 4.55116C14 5.54361 13.6466 6.4526 13.0602 7.15644L15.5926 11.6515C15.7265 11.6378 15.8625 11.6308 16 11.6308C18.2091 11.6308 20 13.442 20 15.6762C20 17.9105 18.2091 19.7217 16 19.7217C14.1362 19.7217 12.5701 18.4325 12.126 16.6876H7.87398C7.42994 18.4325 5.86384 19.7217 4 19.7217C1.79086 19.7217 0 17.9105 0 15.6762C0 13.4626 1.75795 11.6642 3.93893 11.6312L6.77487 6.94464ZM5.96837 12.1537L8.34069 8.23323C8.84616 8.46661 9.40806 8.59665 10 8.59665C10.5007 8.59665 10.9798 8.50362 11.4216 8.33372L13.6951 12.3695C12.9318 12.9147 12.3656 13.7235 12.126 14.6649L7.87398 14.6649C7.60042 13.5899 6.90096 12.6878 5.96837 12.1537ZM10 6.5739C8.89543 6.5739 8 5.66829 8 4.55116C8 3.43403 8.89543 2.52842 10 2.52842C11.1046 2.52842 12 3.43403 12 4.55116C12 5.66829 11.1046 6.5739 10 6.5739ZM4 17.699C2.89543 17.699 2 16.7934 2 15.6762C2 14.5591 2.89543 13.6535 4 13.6535C5.10457 13.6535 6 14.5591 6 15.6762C6 16.7934 5.10457 17.699 4 17.699ZM14 15.6762C14 14.5591 14.8954 13.6535 16 13.6535C17.1046 13.6535 18 14.5591 18 15.6762C18 16.7934 17.1046 17.699 16 17.699C14.8954 17.699 14 16.7934 14 15.6762Z",
  "evenodd"
);
JobsIcon.displayName = "JobsIcon";

// Jobs/Agents main navigation icon - diamond with connected circles
export const JobsMainNavigationIcon: React.FC<IconProps> = ({ size = 20, className, ...props }) => (
  <svg viewBox="0 0 20 20" width={size} height={size} fill="currentColor" className={className} {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12.5838 0C14.2404 0.000310913 15.5838 1.34334 15.5838 3C15.5838 4.65666 14.2404 5.99969 12.5838 6C12.1298 6 11.7 5.89637 11.3143 5.71582L9.84553 7.16309L11.2694 8.58691C11.395 8.71265 11.4986 8.8522 11.5838 8.99902H13.7606C14.173 7.83499 15.2804 7 16.5858 7C18.2425 7.00009 19.5858 8.3432 19.5858 10C19.5858 11.6568 18.2425 12.9999 16.5858 13C15.2796 13 14.1715 12.1641 13.7596 10.999H11.5858C11.5002 11.1472 11.3961 11.2883 11.2694 11.415L9.84163 12.8418L11.2938 14.2939C11.6847 14.1073 12.1217 14 12.5838 14C14.2404 14.0003 15.5838 15.3433 15.5838 17C15.5838 18.6567 14.2404 19.9997 12.5838 20C10.927 20 9.58381 18.6569 9.58381 17C9.58381 16.5366 9.6911 16.0989 9.87874 15.707L8.42756 14.2559L7.34163 15.3428C6.56073 16.1236 5.29458 16.1234 4.51351 15.3428L0.585772 11.415C-0.195266 10.634 -0.195248 9.36797 0.585772 8.58691L4.51351 4.6582C5.29454 3.87782 6.56077 3.87755 7.34163 4.6582L8.43049 5.74707L9.8885 4.31152C9.69515 3.91494 9.58381 3.47089 9.58381 3C9.58381 1.34315 10.927 7.24234e-08 12.5838 0ZM12.5838 16C12.0315 16 11.5838 16.4477 11.5838 17C11.5838 17.5523 12.0315 18 12.5838 18C13.1358 17.9997 13.5838 17.5521 13.5838 17C13.5838 16.4479 13.1358 16.0003 12.5838 16ZM1.99983 10.001L5.92757 13.9287L9.8553 10.001L5.92757 6.07324L1.99983 10.001ZM16.5858 9C16.0335 9 15.5858 9.44772 15.5858 10C15.5858 10.5523 16.0335 11 16.5858 11C17.138 10.9999 17.5858 10.5522 17.5858 10C17.5858 9.44777 17.138 9.00009 16.5858 9ZM12.5838 2C12.0315 2 11.5838 2.44772 11.5838 3C11.5838 3.55228 12.0315 4 12.5838 4C13.1358 3.99969 13.5838 3.55209 13.5838 3C13.5838 2.44791 13.1358 2.00031 12.5838 2Z"/>
  </svg>
);
JobsMainNavigationIcon.displayName = "JobsMainNavigationIcon";

// Spaces icon - layered stacks
export const SpacesIcon = createIcon(
  "M12.5723 1.39355C10.989 0.432945 9.01101 0.432946 7.42775 1.39355L2.34377 4.47902C0.401936 5.6575 0.40194 8.50357 2.34377 9.68205L3.05514 10.1138L2.34377 10.5453C0.401747 11.7237 0.40175 14.5708 2.34377 15.7493L7.42775 18.8338C9.01112 19.7945 10.9889 19.7945 12.5723 18.8338L17.6563 15.7493C19.5983 14.5708 19.5983 11.7237 17.6563 10.5453L16.9448 10.1139L17.6563 9.68205C19.5981 8.50357 19.5981 5.6575 17.6563 4.47902L12.5723 1.39355ZM3.37306 12.2796L4.99854 11.2932L7.42775 12.7675C9.01101 13.7281 10.989 13.7281 12.5723 12.7675L15.0012 11.2934L16.627 12.2796C17.2743 12.6724 17.2743 13.6221 16.627 14.0149L11.544 17.0994C10.5939 17.6759 9.40612 17.6759 8.45607 17.0994L3.37306 14.0149C2.72572 13.6221 2.72572 12.6724 3.37306 12.2796ZM8.45607 3.12789C9.40612 2.55138 10.5939 2.55138 11.544 3.12789L16.627 6.21336C17.2743 6.60618 17.2743 7.55489 16.627 7.94771L11.544 11.0332C10.5939 11.6097 9.40612 11.6097 8.45607 11.0332L3.37306 7.94771C2.72572 7.55489 2.72572 6.60618 3.37306 6.21336L8.45607 3.12789Z"
);
SpacesIcon.displayName = "SpacesIcon";

// VS Code icon - code editor
export const VSCodeIcon = createIcon(
  "M14.5 0.5L18.5 2.5C19.1 2.8 19.5 3.4 19.5 4.1V15.9C19.5 16.6 19.1 17.2 18.5 17.5L14.5 19.5C13.8 19.8 13 19.7 12.4 19.2L6.5 13.5L3.3 16C2.7 16.5 1.8 16.5 1.2 16L0.3 15.2C-0.1 14.7 -0.1 14 0.3 13.5L3 10.5L0.3 7.5C-0.1 7 -0.1 6.3 0.3 5.8L1.2 5C1.8 4.5 2.7 4.5 3.3 5L6.5 7.5L12.4 1.8C13 1.3 13.8 1.2 14.5 0.5ZM14.5 5.5V15.5L9.5 10.5L14.5 5.5Z",
  "evenodd"
);
VSCodeIcon.displayName = "VSCodeIcon";

// Code/Develop icon - angle brackets in rounded rectangle
export const CodeIcon: React.FC<IconProps> = ({ size = 20, className, ...props }) => (
  <svg viewBox="0 0 20 20" width={size} height={size} fill="currentColor" className={className} {...props}>
    <path d="M6.29297 6.29297C6.68349 5.90244 7.31651 5.90244 7.70703 6.29297C8.09754 6.68349 8.09755 7.31651 7.70703 7.70703L5.41406 10L7.70703 12.293C8.09754 12.6835 8.09755 13.3165 7.70703 13.707C7.31651 14.0976 6.68349 14.0975 6.29297 13.707L3.29297 10.707C2.90244 10.3165 2.90244 9.68349 3.29297 9.29297L6.29297 6.29297Z"/>
    <path d="M12.293 6.29297C12.6835 5.90245 13.3165 5.90246 13.707 6.29297L16.707 9.29297C17.0976 9.68349 17.0976 10.3165 16.707 10.707L13.707 13.707C13.3165 14.0976 12.6835 14.0976 12.293 13.707C11.9025 13.3165 11.9024 12.6835 12.293 12.293L14.5859 10L12.293 7.70703C11.9025 7.31651 11.9024 6.68349 12.293 6.29297Z"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M17 0C18.6569 0 20 1.34315 20 3V17C20 18.6569 18.6569 20 17 20H3C1.34315 20 0 18.6569 0 17V3C0 1.34315 1.34315 0 3 0H17ZM3 2C2.44772 2 2 2.44772 2 3V17C2 17.5523 2.44772 18 3 18H17C17.5523 18 18 17.5523 18 17V3C18 2.44772 17.5523 2 17 2H3Z"/>
  </svg>
);
CodeIcon.displayName = "CodeIcon";

// Menu icon - hamburger (matches Figma design)
export const MenuIcon: React.FC<IconProps> = ({ size = 20, className, ...props }) => (
  <svg
    viewBox="0 0 20 16"
    width={size}
    height={size}
    fill="none"
    className={className}
    {...props}
  >
    <path d="M0.777441 0C0.558944 0 0.373476 0.111789 0.221037 0.335366C0.073679 0.566397 0 0.838417 0 1.15142C0 1.46443 0.073679 1.73273 0.221037 1.95631C0.373476 2.17988 0.558944 2.29167 0.777441 2.29167H19.215C19.4335 2.29167 19.6189 2.17988 19.7714 1.95631C19.9238 1.73273 20 1.46443 20 1.15142C20 0.830963 19.9213 0.558944 19.7637 0.335366C19.6113 0.111789 19.4284 0 19.215 0H0.777441ZM0.777441 6.57319C0.558944 6.57319 0.373476 6.68498 0.221037 6.90855C0.073679 7.13958 0 7.4116 0 7.72461C0 8.03762 0.073679 8.30591 0.221037 8.5295C0.373476 8.75307 0.558944 8.86486 0.777441 8.86486H19.215C19.4335 8.86486 19.6189 8.75307 19.7714 8.5295C19.9238 8.30591 20 8.03762 20 7.72461C20 7.40414 19.9213 7.13213 19.7637 6.90855C19.6113 6.68498 19.4284 6.57319 19.215 6.57319H0.777441ZM0.777441 13.1464C0.558944 13.1464 0.373476 13.2582 0.221037 13.4817C0.073679 13.7128 0 13.981 0 14.2866C0 14.6071 0.073679 14.879 0.221037 15.1027C0.373476 15.3263 0.558944 15.4381 0.777441 15.4381H14.6239C14.8423 15.4381 15.0278 15.3263 15.1802 15.1027C15.3327 14.879 15.4089 14.6071 15.4089 14.2866C15.4089 13.9736 15.3302 13.7054 15.1726 13.4817C15.0202 13.2582 14.8373 13.1464 14.6239 13.1464H0.777441Z" fill="currentColor"/>
  </svg>
);
MenuIcon.displayName = "MenuIcon";

// Waveform icon - audio visualization
export const WaveformIcon = createIcon(
  "M3 8 A 1 1 0 0 1 4 9 V 11 A 1 1 0 0 1 3 12 A 1 1 0 0 1 2 11 V 9 A 1 1 0 0 1 3 8 Z M7 5 A 1 1 0 0 1 8 6 V 14 A 1 1 0 0 1 7 15 A 1 1 0 0 1 6 14 V 6 A 1 1 0 0 1 7 5 Z M11 3 A 1 1 0 0 1 12 4 V 16 A 1 1 0 0 1 11 17 A 1 1 0 0 1 10 16 V 4 A 1 1 0 0 1 11 3 Z M15 6 A 1 1 0 0 1 16 7 V 13 A 1 1 0 0 1 15 14 A 1 1 0 0 1 14 13 V 7 A 1 1 0 0 1 15 6 Z"
);
WaveformIcon.displayName = "WaveformIcon";

// Panel close icon
export const PanelCloseIcon = createIcon(
  "M18.2002 3.81201C18.2 3.2311 17.6967 2.69971 17 2.69971H6.90039V17.3003H17C17.6968 17.3003 18.2002 16.7681 18.2002 16.187V3.81201ZM13.4473 7.00342C13.7665 6.69814 14.2727 6.70876 14.5781 7.02783C14.8835 7.34716 14.8721 7.85431 14.5527 8.15967L12.1572 10.4497L14.5527 12.7407C14.872 13.0461 14.8835 13.5523 14.5781 13.8716C14.2728 14.1908 13.7666 14.2022 13.4473 13.897L10.4473 11.0278C10.2895 10.8769 10.2002 10.6681 10.2002 10.4497C10.2002 10.2314 10.2895 10.0225 10.4473 9.87158L13.4473 7.00342ZM1.7998 16.187C1.7998 16.7319 2.24242 17.2331 2.87207 17.2935L3 17.3003H5.2998V2.69971H3C2.30331 2.69971 1.80003 3.2311 1.7998 3.81201V16.187ZM19.7998 16.187C19.7998 17.7184 18.5123 18.8999 17 18.8999H3C1.48771 18.8999 0.200195 17.7184 0.200195 16.187V3.81201C0.200414 2.28078 1.48784 1.1001 3 1.1001H17C18.5122 1.1001 19.7996 2.28078 19.7998 3.81201V16.187Z"
);
PanelCloseIcon.displayName = "PanelCloseIcon";

// Panel open icon
export const PanelOpenIcon = createIcon(
  "M18 3.71094C17.9998 3.12923 17.4962 2.59766 16.7988 2.59766H6.69727V17.2002H16.7988C17.4964 17.2002 18 16.6678 18 16.0859V3.71094ZM10.2217 6.92773C10.5266 6.60917 11.0319 6.59855 11.3506 6.90332L14.3506 9.77148C14.5081 9.92211 14.5976 10.1307 14.5977 10.3486C14.5977 10.5666 14.5081 10.7751 14.3506 10.9258L11.3506 13.7949C11.0318 14.0996 10.5265 14.0882 10.2217 13.7695C9.91684 13.4507 9.9283 12.9455 10.2471 12.6406L12.6426 10.3486L10.2471 8.05762C9.92828 7.75277 9.91683 7.24653 10.2217 6.92773ZM1.59766 16.0859C1.59766 16.6313 2.04006 17.1336 2.66992 17.1943L2.79883 17.2002H5.10059V2.59766H2.79883C2.10146 2.59766 1.59788 3.12923 1.59766 3.71094V16.0859ZM19.5977 16.0859C19.5977 17.6166 18.3104 18.7979 16.7988 18.7979H2.79883C1.28722 18.7979 0 17.6166 0 16.0859V3.71094C0.000205281 2.27606 1.13163 1.14884 2.51855 1.01367L2.79883 1H16.7988C18.3103 1 19.5974 2.1805 19.5977 3.71094V16.0859Z"
);
PanelOpenIcon.displayName = "PanelOpenIcon";

// Cursor icon
export const CursorIcon = createIcon("M4 1L4 15L7.5 11.5L10.5 18L13 17L10 10H15L4 1Z");
CursorIcon.displayName = "CursorIcon";

// Bell icon (notifications)
export const BellIcon = createSapIcon(
  "M475 374q5 7 5 16 0 11-7 18.5t-18 7.5H334q-5 27-27 45.5T256 480t-51-18.5-27-45.5H58q-11 0-18.5-7.5T32 390q0-10 6-16 1-1 8-9.5T61 341t14.5-35.5T82 260v-20q0-100 45-154t129-54 129.5 54T431 240v20q0 25 6.5 45.5T452 341t15 23.5 8 9.5zm-69-9q-11-20-19-46.5t-8-58.5v-20q0-32-5.5-60t-20-50-38-34.5T256 83t-59.5 12.5-38 34.5-20 50-5.5 60v20q0 32-8 58.5T106 365h300z"
);
BellIcon.displayName = "BellIcon";

// Open command field icon (expand sidebar) - navigation collapsed panel
export const OpenCommandFieldIcon = createIcon(
  "M16.5625 1.25C18.461 1.25 20 2.78902 20 4.6875V15.3125C20 17.211 18.461 18.75 16.5625 18.75C12.179 18.75 7.8143 18.75 3.4375 18.75C1.53902 18.75 0 17.211 0 15.3125V4.6875C2.21466e-07 2.78902 1.53902 1.25 3.4375 1.25H16.5625ZM6.875 16.875H16.5625C17.4254 16.875 18.125 16.1754 18.125 15.3125V4.6875C18.125 3.82456 17.4254 3.125 16.5625 3.125H6.875V16.875ZM3.4375 3.125C2.57456 3.125 1.875 3.82456 1.875 4.6875V15.3125C1.875 16.1754 2.57456 16.875 3.4375 16.875H5V3.125H3.4375Z"
);
OpenCommandFieldIcon.displayName = "OpenCommandFieldIcon";

// Close command field icon (collapse sidebar) - navigation expanded panel
export const CloseCommandFieldIcon = createIcon(
  "M16.5625 1.25C18.461 1.25 20 2.78902 20 4.6875V15.3125C20 17.211 18.461 18.75 16.5625 18.75C12.179 18.75 7.8143 18.75 3.4375 18.75C1.53902 18.75 0 17.211 0 15.3125V4.6875C2.21466e-07 2.78902 1.53902 1.25 3.4375 1.25H16.5625ZM6.875 16.875H16.5625C17.4254 16.875 18.125 16.1754 18.125 15.3125V4.6875C18.125 3.82456 17.4254 3.125 16.5625 3.125H6.875V16.875Z"
);
CloseCommandFieldIcon.displayName = "CloseCommandFieldIcon";

const DIAMOND_MASK = "M27.2197 0H10.7803C9.31583 0 7.94296 0.712629 7.10017 1.91028L1.93389 9.25183C0.786893 10.8818 0.848709 13.0721 2.08582 14.6347L15.4718 31.5433C17.2735 33.8191 20.7265 33.8191 22.5282 31.5433L35.9142 14.6347C37.1513 13.0721 37.2131 10.8818 36.0661 9.25183L30.8998 1.91028C30.057 0.712629 28.6842 0 27.2197 0Z";
const SPARKLE = "M27.0522 6.74707C26.9348 6.30227 26.5129 5.99023 26.029 5.99023C25.545 5.99023 25.1232 6.30227 25.0058 6.74707L24.872 7.25413C24.3996 9.04407 22.9244 10.4417 21.035 10.8891L20.4998 11.0159C20.0303 11.1271 19.7009 11.5267 19.7009 11.9852C19.7009 12.4437 20.0303 12.8434 20.4998 12.9546L21.035 13.0813C22.9244 13.5288 24.3996 14.9264 24.872 16.7163L25.0058 17.2234C25.1232 17.6682 25.545 17.9802 26.029 17.9802C26.5129 17.9802 26.9348 17.6682 27.0522 17.2234L27.186 16.7163C27.6583 14.9264 29.1336 13.5288 31.0229 13.0813L31.5582 12.9546C32.0277 12.8434 32.357 12.4437 32.357 11.9852C32.357 11.5267 32.0277 11.1271 31.5582 11.0159L31.0229 10.8891C29.1336 10.4417 27.6583 9.04407 27.186 7.25413L27.0522 6.74707Z";
const FACETS = [
  "M26.0385 12.0005H11.9646L19.0014 36.0005L26.0385 12.0005Z",
  "M0 12.0005L19 36.0005L11.9632 12.0005H0Z",
  "M38 12.0005L19 36.0005L26.0368 12.0005H38Z",
  "M8.44385 0L11.9625 12H26.0365L29.555 0H8.44385Z",
  "M0 12H11.9632L8.44444 0L0 12Z",
  "M38 12H26.0368L29.5556 0L38 12Z",
];
const GRADS: { x1: string; y1: string; x2: string; y2: string; o1?: string; o2?: string; c: [string, string]; h: [string, string] }[] = [
  { x1: "15.0114", y1: "27.9405", x2: "30.444", y2: "17.8113", o1: "0.0785293", c: ["#4013E3", "#F090EB"], h: ["#5a2aff", "#ffa8f5"] },
  { x1: "15.2422", y1: "18.9605", x2: "6.84343", y2: "23.1093", c: ["#5739F5", "#2815A6"], h: ["#6e4dff", "#3b20c9"] },
  { x1: "26.6844", y1: "10.4605", x2: "32.5452", y2: "24.2374", c: ["#F3B2E9", "#4013E3"], h: ["#ffc8f2", "#5a2aff"] },
  { x1: "26.6838", y1: "15.66", x2: "10.4717", y2: "3.61444", o2: "0.995192", c: ["#F3B2E9", "#4013E3"], h: ["#ffc8f2", "#5a2aff"] },
  { x1: "11.2733", y1: "10.4", x2: "-0.662845", y2: "6.5165", c: ["#5739F5", "#2815A6"], h: ["#6e4dff", "#3b20c9"] },
  { x1: "43.3833", y1: "2.44", x2: "30.0232", y2: "16.2756", c: ["#735AF6", "#F090EB"], h: ["#8a6fff", "#ffa8f5"] },
];
const T_STYLE = { transition: "fill 0.3s ease" } as const;

function JouleDiamondDefs({ id, hovered }: { id: (n: string) => string; hovered: boolean }) {
  return (
    <defs>
      {GRADS.map((g, i) => (
        <linearGradient key={i} id={id(`g${i}`)} x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2} gradientUnits="userSpaceOnUse">
          <stop offset={g.o1} stopColor={hovered ? g.h[0] : g.c[0]}/>
          <stop offset={g.o2 ?? "1"} stopColor={hovered ? g.h[1] : g.c[1]}/>
        </linearGradient>
      ))}
    </defs>
  );
}

function JouleDiamondBody({ id }: { id: (n: string) => string }) {
  return (
    <>
      <mask id={id("mask")} style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="1" y="0" width="36" height="34">
        <path d={DIAMOND_MASK} fill="white"/>
        <path d={DIAMOND_MASK} fill="black" fillOpacity="0.2"/>
      </mask>
      <g mask={`url(#${id("mask")})`}>
        {FACETS.map((d, i) => <path key={i} d={d} fill={`url(#${id(`g${i}`)})`} style={T_STYLE}/>)}
        <path d={SPARKLE} fill="white"/>
      </g>
    </>
  );
}

// Joule logo icon - gem shape with sparkle, gradients brighten on hover
export const JouleIcon: React.FC<JouleIconProps & { height?: number }> = ({ size, height, className, isHovered: isHoveredProp, ...props }) => {
  const [selfHovered, setSelfHovered] = useState(false);
  const hovered = isHoveredProp ?? selfHovered;
  const uid = useId();
  const id = (n: string) => `joule-${uid}-${n}`;
  const h = size ?? height ?? 20;
  const w = size ?? Math.round((height ?? 20) * 38 / 36);

  return (
    <svg
      viewBox="0 0 38 36"
      width={w}
      height={h}
      fill="none"
      className={className}
      onMouseEnter={isHoveredProp === undefined ? () => setSelfHovered(true) : undefined}
      onMouseLeave={isHoveredProp === undefined ? () => setSelfHovered(false) : undefined}
      {...props}
    >
      <JouleDiamondDefs id={id} hovered={hovered}/>
      <JouleDiamondBody id={id}/>
    </svg>
  );
};
JouleIcon.displayName = "JouleIcon";

// Joule Work full logo - diamond icon + "Joule Work" text (text is themeable)
export const JouleWorkLogo: React.FC<JouleIconProps & { height?: number }> = ({ size, height = 36, className, isHovered: isHoveredProp, ...props }) => {
  const [selfHovered, setSelfHovered] = useState(false);
  const hovered = isHoveredProp ?? selfHovered;
  const uid = useId();
  const id = (n: string) => `joule-logo-${uid}-${n}`;
  const h = typeof size === "number" ? size : height;
  const w = Math.round(h * 135 / 36);

  return (
    <svg
      viewBox="0 0 135 36"
      width={w}
      height={h}
      fill="none"
      className={className}
      onMouseEnter={isHoveredProp === undefined ? () => setSelfHovered(true) : undefined}
      onMouseLeave={isHoveredProp === undefined ? () => setSelfHovered(false) : undefined}
      {...props}
    >
      <JouleDiamondDefs id={id} hovered={hovered}/>
      <JouleDiamondBody id={id}/>
      <path d="M46.0166 24.1758C44.3643 24.1758 43.0723 23.6924 42.1318 22.6729L43.7754 21.0205C44.3027 21.75 44.9795 22.1104 45.8936 22.1104C47.1768 22.1104 47.8096 21.4072 47.8096 20.001V11.6162H50.1475V20.2119C50.1475 22.6992 48.8467 24.1758 46.0166 24.1758ZM56.6471 24.1758C53.7731 24.1758 51.7516 22.2246 51.7516 19.1924C51.7516 16.1602 53.7731 14.2002 56.6471 14.2002C59.5212 14.2002 61.5427 16.1602 61.5427 19.1924C61.5427 22.2246 59.5212 24.1758 56.6471 24.1758ZM54.0807 19.1924C54.0807 21.2578 55.153 22.374 56.6471 22.374C58.1413 22.374 59.2136 21.2578 59.2136 19.1924C59.2136 17.1182 58.1413 16.0107 56.6471 16.0107C55.153 16.0107 54.0807 17.1182 54.0807 19.1924ZM66.0033 24.1758C63.9466 24.1758 63.015 22.7695 63.015 20.7217V14.3848H65.2474V20.1943C65.2474 21.4775 65.6869 22.2686 66.9789 22.2686C68.306 22.2686 69.1322 21.3809 69.1322 19.7637V14.3848H71.347V24H69.2025V21.9697H69.1586C68.7191 23.0771 67.849 24.1758 66.0033 24.1758ZM75.9395 24.1582C74.1289 24.1582 73.4346 23.2969 73.4346 21.6357V10.8955H75.667V21.249C75.667 21.9961 75.8428 22.2598 76.4844 22.2598C76.7569 22.2598 76.9942 22.2158 77.2491 22.1631V24C76.8975 24.0879 76.4229 24.1582 75.9395 24.1582ZM82.9489 24.1758C79.864 24.1758 77.9304 22.4092 77.9304 19.1924C77.9304 15.8438 80.1364 14.2002 82.7556 14.2002C85.9724 14.2002 87.115 16.5557 87.115 18.8936C87.115 19.1748 87.0974 19.4648 87.0798 19.7373H80.2771C80.4353 21.5654 81.3845 22.4355 83.0544 22.4355C84.1355 22.4355 84.8562 22.1191 85.5066 21.3633L86.7986 22.6553C85.9021 23.666 84.8034 24.1758 82.9489 24.1758ZM80.3122 18.3574H84.9001C84.7771 16.6611 83.9509 15.9141 82.7029 15.9141C81.4724 15.9141 80.532 16.6611 80.3122 18.3574Z" fill="var(--joule-logo-1)"/>
      <path d="M94.5245 24L91.422 11.6162H93.8477L95.4737 18.6387C95.7989 20.0098 96.0274 21.1611 96.1241 21.8555C96.2384 21.1611 96.4669 20.0449 96.7921 18.6387L98.3917 11.6162H100.967L102.566 18.6387C102.883 20.0449 103.12 21.1611 103.234 21.8555C103.34 21.1611 103.568 20.0098 103.885 18.6387L105.511 11.6162H107.875L104.773 24H101.925L100.193 16.8018C99.9825 15.9053 99.7979 15.0088 99.6661 14.2354C99.5343 15.0088 99.3497 15.9053 99.1387 16.8018L97.4073 24H94.5245ZM112.678 24.1758C109.804 24.1758 107.783 22.2246 107.783 19.1924C107.783 16.1602 109.804 14.2002 112.678 14.2002C115.552 14.2002 117.574 16.1602 117.574 19.1924C117.574 22.2246 115.552 24.1758 112.678 24.1758ZM110.112 19.1924C110.112 21.2578 111.184 22.374 112.678 22.374C114.173 22.374 115.245 21.2578 115.245 19.1924C115.245 17.1182 114.173 16.0107 112.678 16.0107C111.184 16.0107 110.112 17.1182 110.112 19.1924ZM119.125 24V14.3848H121.279V16.4502H121.314C121.639 14.9121 122.36 14.2002 123.564 14.2002C123.915 14.2002 124.214 14.2617 124.39 14.3232V16.4062C124.153 16.3447 123.801 16.292 123.467 16.292C121.885 16.292 121.349 17.3818 121.349 19.166V24H119.125ZM125.713 24V10.8955H127.937V18.5771L131.505 14.3848H134.133L130.485 18.4277L134.344 24H131.734L128.93 19.7725L127.937 20.7832V24H125.713Z" fill="var(--joule-logo-2)"/>
    </svg>
  );
};
JouleWorkLogo.displayName = "JouleWorkLogo";

// Conversations selected icon (purple gradient chat bubbles)
export const ConversationsSelectedIcon: React.FC<IconProps> = ({ size = 20, className, ...props }) => {
  const uid = useId();
  const id = (n: string) => `conv-filled-${uid}-${n}`;
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} fill="none" className={className} {...props}>
      <g filter={`url(#${id("f")})`}>
        <path d="M8 15H14C15.6569 15 17 13.6569 17 12V6" stroke="var(--joule-gradient-color-4)" strokeWidth="0.5" strokeLinecap="round"/>
      </g>
      <path d="M20 14.5V7.5C20 6.11929 18.8807 5 17.5 5H8C7.44771 5 7 5.44772 7 6V14.5C7 15.8807 8.11929 17 9.5 17H12.3789C12.5114 17.0001 12.6387 17.0528 12.7324 17.1465L15.293 19.707C15.579 19.993 16.0091 20.0786 16.3828 19.9238C16.7564 19.769 17 19.4044 17 19V17H17.5C18.8807 17 20 15.8807 20 14.5Z" fill={`url(#${id("g0")})`}/>
      <path d="M16 11.5C15.9998 12.8803 14.8809 14 13.5 14H7.49902L4.7998 17.5996C4.54155 17.944 4.09194 18.0844 3.68359 17.9482C3.27541 17.812 3 17.4303 3 17V14H2.5C1.11929 14 0 12.8807 0 11.5V3.5C0 2.11929 1.11929 1 2.5 1H13.5C14.8809 1 15.9998 2.11971 16 3.5V11.5Z" fill={`url(#${id("g1")})`}/>
      <path d="M12 8C12.5523 8 13 8.44772 13 9C13 9.55228 12.5523 10 12 10H4C3.44772 10 3 9.55228 3 9C3 8.44772 3.44772 8 4 8H12Z" fill="var(--joule-gradient-foreground)"/>
      <path d="M9 5C9.55228 5 10 5.44772 10 6C10 6.55228 9.55228 7 9 7H4C3.44772 7 3 6.55228 3 6C3 5.44772 3.44772 5 4 5H9Z" fill="var(--joule-gradient-foreground)"/>
      <defs>
        <filter id={id("f")} x="5.75" y="3.75" width="13.5" height="13.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="bg"/><feBlend in="SourceGraphic" in2="bg" result="shape"/><feGaussianBlur stdDeviation="1" result="blur"/>
        </filter>
        <linearGradient id={id("g0")} x1="23" y1="24.5" x2="13" y2="12.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--joule-gradient-color-1)"/><stop offset="0.4" stopColor="var(--joule-gradient-color-2)"/><stop offset="1" stopColor="var(--joule-gradient-color-4)"/>
        </linearGradient>
        <linearGradient id={id("g1")} x1="16" y1="4" x2="3" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--joule-gradient-color-1)"/><stop offset="0.487" stopColor="var(--joule-gradient-color-2)"/><stop offset="1" stopColor="var(--joule-gradient-color-3)"/>
        </linearGradient>
      </defs>
    </svg>
  );
};
ConversationsSelectedIcon.displayName = "ConversationsSelectedIcon";

// Discover selected icon (purple gradient circle with compass)
export const DiscoverSelectedIcon: React.FC<IconProps> = ({ size = 20, className, ...props }) => {
  const uid = useId();
  const id = (n: string) => `disc-filled-${uid}-${n}`;
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} fill="none" className={className} {...props}>
      <circle cx="10" cy="10" r="10" transform="rotate(-90 10 10)" fill={`url(#${id("g0")})`}/>
      <g filter={`url(#${id("f")})`}>
        <path d="M6.5 9V10.3944C6.5 11.3975 7.0013 12.3342 7.8359 12.8906L11.5177 15.3452C12.0889 15.7259 12.8494 15.6506 13.3348 15.1652C13.4442 15.0558 13.5353 14.9294 13.6045 14.791L14 14" stroke="var(--joule-gradient-color-4)" strokeLinecap="round"/>
      </g>
      <path d="M12.0904 14.5341L7.87037 11.4639C7.75597 11.3807 7.68218 11.2529 7.6673 11.1122L7.1184 5.92243C7.07283 5.49158 7.55945 5.21064 7.90979 5.46552L12.1298 8.53575C12.2442 8.61898 12.318 8.74679 12.3329 8.88748L12.8817 14.0772C12.9273 14.5081 12.4407 14.789 12.0904 14.5341Z" fill="var(--joule-gradient-foreground)"/>
      <defs>
        <filter id={id("f")} x="2" y="4.5" width="16.5" height="15.587" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="bg"/><feBlend in="SourceGraphic" in2="bg" result="shape"/><feGaussianBlur stdDeviation="2" result="blur"/>
        </filter>
        <linearGradient id={id("g0")} x1="17" y1="14" x2="5" y2="7" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--joule-gradient-color-1)"/><stop offset="0.6" stopColor="var(--joule-gradient-color-2)"/><stop offset="1" stopColor="var(--joule-gradient-color-3)"/>
        </linearGradient>
      </defs>
    </svg>
  );
};
DiscoverSelectedIcon.displayName = "DiscoverSelectedIcon";

// Spaces selected icon (purple gradient stacked layers)
export const SpacesSelectedIcon: React.FC<IconProps> = ({ size = 20, className, ...props }) => {
  const uid = useId();
  const id = (n: string) => `spaces-filled-${uid}-${n}`;
  return (
    <svg viewBox="2.5 0 20 20" width={size} height={size} fill="none" className={className} {...props}>
      <path d="M10.0404 7.42675C11.6237 6.46615 13.6017 6.46615 15.1849 7.42675L20.2689 10.5122C22.2108 11.6907 22.2108 14.5368 20.2689 15.7153L19.5574 16.1471L17.6139 17.3266L15.1849 18.8007C13.6017 19.7613 11.6237 19.7613 10.0404 18.8007L7.61121 17.3264L5.66781 16.147L4.95643 15.7153C3.01461 14.5368 3.0146 11.6907 4.95643 10.5122L10.0404 7.42675Z" fill={`url(#${id("g0")})`}/>
      <g filter={`url(#${id("f")})`}>
        <path d="M4.50006 10.7063L10.9101 14.7126C11.8829 15.3206 13.1172 15.3206 14.0901 14.7126L20.5001 10.7063" stroke="var(--joule-gradient-color-4)" strokeLinecap="round"/>
      </g>
      <path d="M10.0404 1.42675C11.6237 0.466149 13.6017 0.466148 15.1849 1.42675L20.2689 4.51222C22.2108 5.69071 22.2108 8.53677 20.2689 9.71525L19.5574 10.1471L17.6139 11.3266L15.1849 12.8007C13.6017 13.7613 11.6237 13.7613 10.0404 12.8007L7.61121 11.3264L5.66781 10.147L4.95643 9.71525C3.01461 8.53677 3.0146 5.69071 4.95643 4.51222L10.0404 1.42675Z" fill={`url(#${id("g1")})`}/>
      <defs>
        <filter id={id("f")} x="0" y="6.206" width="25" height="13.462" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="bg"/><feBlend in="SourceGraphic" in2="bg" result="shape"/><feGaussianBlur stdDeviation="2" result="blur"/>
        </filter>
        <linearGradient id={id("g0")} x1="12.6127" y1="10.7063" x2="12.6127" y2="25.7063" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--joule-gradient-color-4)"/><stop offset="0.6" stopColor="var(--joule-gradient-color-2)"/><stop offset="1" stopColor="var(--joule-gradient-color-1)"/>
        </linearGradient>
        <linearGradient id={id("g1")} x1="12.6127" y1="0.7063" x2="12.6127" y2="12.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--joule-gradient-color-3)"/><stop offset="0.4" stopColor="var(--joule-gradient-color-2)"/><stop offset="1" stopColor="var(--joule-gradient-color-1)"/>
        </linearGradient>
      </defs>
    </svg>
  );
};
SpacesSelectedIcon.displayName = "SpacesSelectedIcon";

// Jobs/Agents main navigation selected icon (purple gradient diamond with connected nodes)
export const JobsMainNavigationSelectedIcon: React.FC<IconProps> = ({ size = 20, className, ...props }) => {
  const uid = useId();
  const id = (n: string) => `jobs-filled-${uid}-${n}`;
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} fill="none" className={className} {...props}>
      <path d="M10.5829 8.99902H15.1991V10.999H10.5829V8.99902ZM10.6503 3.78711L12.0546 5.21289L9.51651 7.71289L8.11221 6.28711L10.6503 3.78711ZM9.52139 12.293L12.0214 14.793L10.6073 16.207L8.10733 13.707L9.52139 12.293Z" fill={`url(#${id("g0")})`}/>
      <path d="M12.8124 14C14.4693 14 15.8124 15.3431 15.8124 17C15.8124 18.6569 14.4693 20 12.8124 20C11.1556 20 9.81241 18.6569 9.81241 17C9.81241 15.3431 11.1556 14 12.8124 14Z" fill={`url(#${id("g1")})`}/>
      <path d="M16.8124 7C18.4692 7 19.8124 8.34315 19.8124 10C19.8124 11.6569 18.4692 13 16.8124 13C15.1555 13 13.8124 11.6569 13.8124 10C13.8124 8.34315 15.1555 7 16.8124 7Z" fill={`url(#${id("g2")})`}/>
      <path d="M12.8124 0C14.4693 0 15.8124 1.34315 15.8124 3C15.8124 4.65685 14.4693 6 12.8124 6C11.1556 6 9.81241 4.65685 9.81241 3C9.81241 1.34315 11.1556 0 12.8124 0Z" fill={`url(#${id("g3")})`}/>
      <path d="M4.74194 4.65868C5.52299 3.87763 6.78932 3.87763 7.57037 4.65868L11.4981 8.58644C12.2792 9.36749 12.2792 10.6338 11.4981 11.4149L7.57037 15.3426C6.78932 16.1237 5.52299 16.1237 4.74194 15.3426L0.814187 11.4149C0.0331395 10.6338 0.0331381 9.36749 0.814187 8.58644L4.74194 4.65868Z" fill={`url(#${id("g4")})`}/>
      <defs>
        <linearGradient id={id("g0")} x1="15" y1="10" x2="5.5" y2="10" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--joule-gradient-color-1)"/><stop offset="0.4" stopColor="var(--joule-gradient-color-2)"/><stop offset="1" stopColor="var(--joule-gradient-color-3)"/>
        </linearGradient>
        <linearGradient id={id("g1")} x1="15.1062" y1="12" x2="12.1062" y2="18.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--joule-gradient-color-1)"/><stop offset="0.6" stopColor="var(--joule-gradient-color-2)"/><stop offset="1" stopColor="var(--joule-gradient-color-3)"/>
        </linearGradient>
        <linearGradient id={id("g2")} x1="19.6062" y1="6" x2="16.1062" y2="11.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--joule-gradient-color-1)"/><stop offset="0.6" stopColor="var(--joule-gradient-color-2)"/><stop offset="1" stopColor="var(--joule-gradient-color-3)"/>
        </linearGradient>
        <linearGradient id={id("g3")} x1="15.1062" y1="-1" x2="12.1062" y2="4.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--joule-gradient-color-1)"/><stop offset="0.6" stopColor="var(--joule-gradient-color-2)"/><stop offset="1" stopColor="var(--joule-gradient-color-3)"/>
        </linearGradient>
        <linearGradient id={id("g4")} x1="10.6072" y1="2.5" x2="4.60721" y2="12" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--joule-gradient-color-1)"/><stop offset="0.6" stopColor="var(--joule-gradient-color-2)"/><stop offset="1" stopColor="var(--joule-gradient-color-3)"/>
        </linearGradient>
      </defs>
    </svg>
  );
};
JobsMainNavigationSelectedIcon.displayName = "JobsMainNavigationSelectedIcon";

// Code/Develop selected icon (purple gradient rounded rect with white brackets)
export const CodeSelectedIcon: React.FC<IconProps> = ({ size = 20, className, ...props }) => {
  const uid = useId();
  const id = (n: string) => `code-filled-${uid}-${n}`;
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} fill="none" className={className} {...props}>
      <path d="M20 17C20 18.6569 18.6569 20 17 20H3C1.34315 20 0 18.6569 0 17V3C0 1.34315 1.34315 0 3 0H17C18.6569 0 20 1.34315 20 3V17Z" fill={`url(#${id("g0")})`}/>
      <path d="M6.29295 6.29295C6.68348 5.90243 7.31649 5.90243 7.70702 6.29295C8.09754 6.68348 8.09754 7.31649 7.70702 7.70702L5.41405 9.99999L7.70702 12.293C8.09754 12.6835 8.09754 13.3165 7.70702 13.707C7.31649 14.0975 6.68348 14.0975 6.29295 13.707L3.29295 10.707C2.90243 10.3165 2.90243 9.68348 3.29295 9.29295L6.29295 6.29295Z" fill="var(--joule-gradient-foreground)"/>
      <path d="M13.707 13.707C13.3165 14.0976 12.6835 14.0976 12.293 13.707C11.9025 13.3165 11.9025 12.6835 12.293 12.293L14.586 10L12.293 7.70705C11.9025 7.31652 11.9025 6.68351 12.293 6.29298C12.6835 5.90246 13.3165 5.90246 13.707 6.29298L16.707 9.29298C17.0976 9.68351 17.0976 10.3165 16.707 10.707L13.707 13.707Z" fill="var(--joule-gradient-foreground)"/>
      <defs>
        <linearGradient id={id("g0")} x1="22.5" y1="-8" x2="5" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--joule-gradient-color-1)"/><stop offset="0.6" stopColor="var(--joule-gradient-color-2)"/><stop offset="1" stopColor="var(--joule-gradient-color-3)"/>
        </linearGradient>
      </defs>
    </svg>
  );
};
CodeSelectedIcon.displayName = "CodeSelectedIcon";

// More/Overflow icon - three horizontal dots (matches Figma design)
export const MoreIcon: React.FC<IconProps> = ({ size = 20, className, ...props }) => (
  <svg
    viewBox="0 0 20 20"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M2.5 7.5C3.88071 7.5 5 8.61929 5 10C5 11.3807 3.88071 12.5 2.5 12.5C1.11929 12.5 0 11.3807 0 10C0 8.61929 1.11929 7.5 2.5 7.5ZM10 7.5C11.3807 7.5 12.5 8.61929 12.5 10C12.5 11.3807 11.3807 12.5 10 12.5C8.61929 12.5 7.5 11.3807 7.5 10C7.5 8.61929 8.61929 7.5 10 7.5ZM17.5 7.5C18.8807 7.5 20 8.61929 20 10C20 11.3807 18.8807 12.5 17.5 12.5C16.1193 12.5 15 11.3807 15 10C15 8.61929 16.1193 7.5 17.5 7.5Z" />
  </svg>
);
MoreIcon.displayName = "MoreIcon";

// New conversation icon - chat bubble with plus sign (toggle end pane button, matches Figma)
export const NewConversationIcon: React.FC<IconProps> = ({ size = 20, className, ...props }) => (
  <svg
    viewBox="0 0 20 20"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M0 3.57129C7.53742e-05 1.59896 1.59895 7.5374e-05 3.57129 0H10C10.5523 0 11 0.447716 11 1C11 1.55229 10.5523 2 10 2H3.57129C2.70352 2.00008 2.00008 2.70353 2 3.57129V16.586L5.43555 13.1504L5.50879 13.084C5.68672 12.9381 5.91045 12.8575 6.14258 12.8574H16.4287C17.2964 12.8574 17.9998 12.1538 18 11.2861V9.9463C18.0003 9.39424 18.4479 8.9463 19 8.9463C19.5521 8.9463 19.9997 9.39424 20 9.9463V11.2861C19.9998 13.2584 18.401 14.8574 16.4287 14.8574H6.55664L1.70703 19.7071C1.42103 19.9931 0.990862 20.0786 0.617188 19.9239C0.243586 19.769 0 19.4044 0 19V3.57129Z" />
    <path d="M5 11C4.44772 11 4 10.5523 4 10C4 9.44773 4.44772 9.00001 5 9.00001H10C10.5523 9.00001 11 9.44773 11 10C11 10.5523 10.5523 11 10 11H5Z" />
    <path d="M5 7.00001C4.44772 7.00001 4 6.55229 4 6.00001C4 5.44772 4.44772 5.00001 5 5.00001L8 5.00001C8.55229 5.00001 9 5.44772 9 6.00001C9 6.55229 8.55229 7.00001 8 7.00001H5Z" />
    <path d="M16.8571 0.847507C16.8571 0.379442 16.4734 0 16 0C15.5266 0 15.1429 0.379442 15.1429 0.847507V3.10752H12.8571C12.3838 3.10752 12 3.48697 12 3.95503C12 4.42307 12.3838 4.80254 12.8571 4.80254H15.1429V7.06256C15.1429 7.53059 15.5266 7.91006 16 7.91006C16.4734 7.91006 16.8571 7.53059 16.8571 7.06256V4.80254L19.231 4.79813C19.663 4.75448 20 4.39364 20 3.95503C20 3.5164 19.663 3.15558 19.231 3.11194L16.8571 3.10752V0.847507Z" />
  </svg>
);
NewConversationIcon.displayName = "NewConversationIcon";

// Right panel toggle icons (mirrors of Open/CloseCommandFieldIcon for right side)
export const OpenCommandFieldRightIcon = createIcon(
  "M3.4375 1.25C1.53902 1.25 0 2.78902 0 4.6875V15.3125C0 17.211 1.53902 18.75 3.4375 18.75C7.82102 18.75 12.1857 18.75 16.5625 18.75C18.461 18.75 20 17.211 20 15.3125V4.6875C20 2.78902 18.461 1.25 16.5625 1.25H3.4375ZM13.125 16.875H3.4375C2.57456 16.875 1.875 16.1754 1.875 15.3125V4.6875C1.875 3.82456 2.57455 3.125 3.4375 3.125H13.125V16.875ZM16.5625 3.125C17.4254 3.125 18.125 3.82456 18.125 4.6875V15.3125C18.125 16.1754 17.4254 16.875 16.5625 16.875H15V3.125H16.5625Z"
);
OpenCommandFieldRightIcon.displayName = "OpenCommandFieldRightIcon";

export const CloseCommandFieldRightIcon = createIcon(
  "M3.4375 1.25C1.53902 1.25 0 2.78902 0 4.6875V15.3125C2.21466e-07 17.211 1.53902 18.75 3.4375 18.75C7.82102 18.75 12.1857 18.75 16.5625 18.75C18.461 18.75 20 17.211 20 15.3125V4.6875C20 2.78902 18.461 1.25 16.5625 1.25H3.4375ZM13.125 16.875H3.4375C2.57456 16.875 1.875 16.1754 1.875 15.3125V4.6875C1.875 3.82456 2.57455 3.125 3.4375 3.125H13.125V16.875Z"
);
CloseCommandFieldRightIcon.displayName = "CloseCommandFieldRightIcon";
