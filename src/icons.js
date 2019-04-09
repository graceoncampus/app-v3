import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Polyline } from 'react-native-svg';

const iconStyle = {
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  strokeWidth: 1.5,
  fill: 'none',
  stroke: '#222',
};

export const Logo = ({
  style, width, height, color,
}) => (
  <View pointerEvents="none">
    <Svg
      style={style}
      width={width}
      height={height}
      viewBox="96 78 91 36"
    >
      <Path
        fill={color}
        d="M125.853 82.305c1.08.942 1.826 1.803 1.826 1.803s-.539.691-.982 1.404c-.489.787-.925 1.761-1.113 2.137-.45.902-1.076 3.268-1.153 3.24-.079-.03-.462-.889-1.107-1.779-.505-.693-1.136-1.375-1.512-1.7-1.659-1.433-3.157-2.334-6.094-2.764a9.643 9.643 0 0 0-2.77.022 11.59 11.59 0 0 0-4.989 2.03c-1.068.776-2.225 2.012-3.053 3.496-.462.826-.989 2.254-1.099 2.785-.42 2.06-.363 3.54.014 5.035.316 1.255.752 2.306 1.31 3.195.481.771.79 1.135.953 1.33.823.988 2.044 1.953 3.206 2.597 1.138.63 2.452 1 3.61 1.2.57.096 1.454.135 2.27.086.508-.03.996-.11 1.341-.179 1.28-.258 2.143-.652 2.394-.748 1.526-.583 3.55-2.257 4.6-3.82.798-1.188 1.376-2.832 1.376-2.832l-6.408-.012s-.793-.058-1.527-.43a3.138 3.138 0 0 1-1.323-1.293c-.402-.713-.462-1.672-.133-2.453.34-.802 1.055-1.309 1.511-1.56.712-.392 1.673-.42 1.673-.42l6.93-.004s.37-2.563 1.536-4.88a22.702 22.702 0 0 1 1.658-2.723 21.438 21.438 0 0 1 1.947-2.289c1.212-1.214 2.606-2.237 3.785-2.84 1.587-.813 2.191-1.003 4.096-1.55 1.025-.295 3.585-.486 5.64-.338 2.115.153 4.046.647 4.774.938a17.8 17.8 0 0 1 5.873 3.844c.944.944 2.09 2.52 2.09 2.52.675-.967 1.071-1.343 1.465-1.789.817-.919 1.307-1.275 2.303-2.072 1.232-.986 2.904-1.829 4.122-2.29a18.383 18.383 0 0 1 4.733-1.113c2.225-.225 4.356.05 6.173.551.953.264 2.678.846 4.266 1.803a19.1 19.1 0 0 1 4.64 3.985 17.312 17.312 0 0 1 2.508 4.1c.274.647.536 1.174.54 1.521.012 1.854-3.258 2.443-4.11 2.297-1.149-.196-2.068-.65-2.342-1.156-.188-.349-.379-.748-.58-1.12-.44-.803-.984-1.649-2.27-2.806-.807-.727-2.366-1.735-3.832-2.174-2.762-.83-4.405-.53-5.562-.313-1.06.2-3.385.945-5.409 2.828-1.578 1.47-2.438 3.378-2.865 4.647-.61 1.811-.383 2.983-.582 4.911-.218 2.116-.797 4.042-1.287 5.191-.688 1.614-2.076 4.528-5.609 7.255-1.582 1.223-3.379 2.112-5.618 2.788-1.52.46-3.467.644-5.026.634-1.987-.015-4.276-.47-5.704-.972-3.004-1.055-4.73-2.587-5.239-3-1.516-1.232-3.167-3.28-3.167-3.28s-3.349 5.071-9.783 6.642c-2.026.494-4.23.698-6.544.382-3.598-.492-6.65-1.968-8.715-3.698-1.453-1.217-3.02-2.94-4.154-4.886-1.408-2.41-2.11-5.11-2.302-7.318-.196-2.257.135-5.276 1.222-7.96.845-2.09 2.18-3.949 3.48-5.4 1.487-1.663 3.532-3.054 5.605-3.97 2.058-.91 4.142-1.352 5.747-1.462 1.276-.087 2.951-.046 4.308.186 1.756.301 3.266.886 4.258 1.312 1.168.503 2.981 1.651 4.18 2.698m16.963 2.05c-6.07 0-10.993 5.05-10.993 11.277 0 6.23 4.922 11.277 10.993 11.277 6.072 0 10.994-5.048 10.994-11.277 0-6.228-4.922-11.277-10.994-11.277m21.656 19.722c-2.042-1.67-3.037-3.78-3.14-3.75-.1.028-.777 2.412-1.433 3.816-.466 1.001-1.78 2.842-1.78 2.842s1.587 1.778 3.635 3.171c1.574 1.071 3.616 1.812 4.217 1.963.49.123 2.002.605 3.95.756.822.064 1.74.062 2.667-.014.53-.044 1.063-.13 1.592-.196 2.52-.319 5.256-1.839 5.751-2.1.645-.343 2.173-1.355 3.57-2.729 1.244-1.22 2.301-2.795 2.618-3.337.75-1.28 1.607-2.66 1.344-3.49-.26-.829-1.053-1.708-2.477-2.094-1.472-.398-2.583-.13-3.018.175-.437.305-.597.363-.99 1.25-.126.287-.622 1.263-1.46 2.233-.733.845-1.639 1.571-2.314 2.043-1.354.947-2.989 1.495-4.406 1.694-1.344.19-2.492.053-3.046 0-1.207-.117-3.622-.877-5.28-2.233"
      />
    </Svg>
  </View>
);

export const Phone = ({ style, fill = '#222' }) => (
  <View pointerEvents="none">
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      style={style}
    >
      <Path {...iconStyle} stroke={fill} d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </Svg>
  </View>
);

export const Message = ({ style, fill = '#222' }) => (
  <View pointerEvents="none">
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      style={style}
    >
      <Path {...iconStyle} stroke={fill} d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </Svg>
  </View>
);

export const Mail = ({ style, fill = '#222' }) => (
  <View pointerEvents="none">
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      style={style}
    >
      <Path
        {...iconStyle}
        stroke={fill}
        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
      />
      <Polyline {...iconStyle} stroke={fill} points="22,6 12,13 2,6" />
    </Svg>
  </View>
);
export const Edit = () => (
  <View pointerEvents="none">
    <Svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
      <Path {...iconStyle} d="M20 15v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5" />
      <Path {...iconStyle} d="M18 2l4 4-10 10H8v-4L18 2z" />
    </Svg>
  </View>
);

export const New = () => (
  <View pointerEvents="none">
    <Svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <Path {...iconStyle} d="M12 5v14M5 12h14" />
    </Svg>
  </View>
);

export const Menu = () => (
  <View pointerEvents="none">
    <Svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" fill="none" viewBox="0 0 18 14">
      <Path
        d="M1 7h15.998M1 1.576h15.998M1 12.424h15.998"
        fill="none"
        fillRule="evenodd"
        strokeLinecap="round"
        stroke="#222"
        strokeWidth="2"
      />
    </Svg>
  </View>
);

export const Chevron = ({ style }) => (
  <View pointerEvents="none">
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" style={{ marginTop: 20, ...style }} opacity="0.5" width="20" height="20" viewBox="0 0 24 24">
      <Path {...iconStyle} d="M9 18l6-6-6-6" />
    </Svg>
  </View>
);

export const Back = () => (
  <View pointerEvents="none">
    <Svg xmlns="http://www.w3.org/2000/svg" width="38" height="25" fill="none" viewBox="0 0 24 24">
      <Path {...iconStyle} d="M19 12H5M12 19l-7-7 7-7" />
    </Svg>
  </View>
);

export const Eye = () => (
  <View pointerEvents="none">
    <Svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24">
      <Path {...iconStyle} d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <Circle {...iconStyle} cx="12" cy="12" r="3" />
    </Svg>
  </View>
);

export const Play = ({ width, dark }) => (
  <View pointerEvents="none">
    <Svg viewBox="0 0 68 68" fill={dark ? '#222' : '#fff'} version="1" width={width} height={width} xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M34 68a34 34 0 1 1 0-68 34 34 0 0 1 0 68zm0-2a32 32 0 1 0 0-64 32 32 0 0 0 0 64z"
        fillRule="nonzero"
      />
      <Path d="M26 20v28l22-14z" />
    </Svg>
  </View>
);

export const Pause = ({ width, dark }) => (
  <View pointerEvents="none">
    <Svg viewBox="0 0 68 68" fill={dark ? '#222' : '#fff'} version="1" width={width} height={width} xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M34 68a34 34 0 1 1 0-68 34 34 0 0 1 0 68zm0-2a32 32 0 1 0 0-64 32 32 0 0 0 0 64z"
        fillRule="nonzero"
      />
      <Path d="M22 20h8v28h-8zM38 20h8v28h-8z" />
    </Svg>
  </View>
);

export const Previous = ({ width, dark }) => (
  <View pointerEvents="none">
    <Svg viewBox="0 0 19 19" fill={dark ? '#222' : '#fff'} version="1" width={width} height={width} xmlns="http://www.w3.org/2000/svg">
      <Path d="M0 0h3v18H0zM18 18V0L6 9z" fill="#FFF" fillRule="evenodd" />
    </Svg>
  </View>
);

export const Next = ({ width, dark }) => (
  <View pointerEvents="none">
    <Svg viewBox="0 0 19 19" fill={dark ? '#222' : '#fff'} version="1" width={width} height={width} xmlns="http://www.w3.org/2000/svg">
      <Path d="M19 19h-3V1h3zM1 1v18l12-9z" fill="#FFF" fillRule="evenodd" />
    </Svg>
  </View>
);

export const ArrowDown = () => (
  <View pointerEvents="none">
    <Svg viewBox="0 0 14 9" version="1" width="14" height="9" xmlns="http://www.w3.org/2000/svg">
      <Path d="M1 2l1-1 5 4 5-4 1 1-6 6z" fill="#FFF" fillRule="evenodd" />
    </Svg>
  </View>
);

export const Check = ({ width = 15, fill = 'green', ...props }) => (
  <View pointerEvents="none">
    <Svg viewBox="0 0 47 47" width={width} height={width} {...props} xmlns="http://www.w3.org/2000/svg">
      <Path
        fill={fill}
        d="M23.129 46.522C10.479 46.522.225 36.267.225 23.618.225 10.968 10.48.715 23.13.715c12.65 0 22.903 10.254 22.903 22.903 0 12.65-10.254 22.904-22.903 22.904zm9.158-29.755l-11.46 11.46-4.856-4.857a2 2 0 0 0-2.828 2.828l6.27 6.27a2 2 0 0 0 2.829 0l12.873-12.872a2 2 0 0 0-2.828-2.829z"
        fillRule="evenodd"
      />
    </Svg>
  </View>
);
