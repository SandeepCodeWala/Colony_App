// import React, { useState,useEffect } from 'react'
// import { Modal, View, StyleSheet, Image, Text } from 'react-native'
// import { Icons, InputText, Button, Header } from '@beverages/common'
// import { colors, family, fonts, metrics, styles } from '@beverages/themes'
// import * as Progress from 'react-native-progress';

// // import { DotIndicator, MaterialIndicator, UIActivityIndicator, BallIndicator } from 'react-native-indicators'
// // import colors from '../../themes/colors'

// function ActivityIndicator(props) {
// const [progress, setProgress] = useState(0.3)

// // useEffect(()=>{
// //   setInterval(()=>{
// //     setProgress(progress+0.3)
// //   }, 100)
// // },[props])

//   return (
//     <Modal
//       animationType="fade"
//       transparent={false}
//       visible={props.animating}
//       onRequestClose={() => {
//         props.animating
//       }}
//     >
//       <View style={Styles.container}>
//         {/* <BallIndicator color={"#451C96"} /> */}
//         <View style={{
//           height: 240,
//           width: '50%',
//           marginTop: 220,
//           alignItems: 'center',
//         }}>
//           <Image style={[{ resizeMode: 'contain', height: 130, width: 130, marginTop: 10, marginBottom: 12 }]} source={Icons.PlayingCards} />
//           <Text style={[family.Montserrat_Bold,{fontSize: 30, fontWeight: 'bold', color: colors.white}]}>Beverages</Text>
//           <Progress.Bar marginTop={15} indeterminate={true} borderColor={"transparent"} height={8} animationType={"spring"} borderWidth={0} color={"#283A52"}  progress={progress} width={122} unfilledColor="#fff"/>
//         </View>
//       </View>
//     </Modal>
//   )
// }

// const Styles = StyleSheet.create({
//   container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.lightthemeColor },
//   backgroundVideo: {
//     position: "absolute",
//     top: 0,
//     // height:100,
//     // width:100,
//     left: 0,
//     alignItems: "stretch",
//     bottom: 0,
//     right: 0,

//   },
// })
// export default ActivityIndicator

import React from 'react';
import { Modal, View, StyleSheet, Image } from 'react-native';

import { AppImages } from '../res';
import { colors, family, fonts, metrics, styles } from '../themes';

const ActivityIndicator = props => {
  return (
    // <Modal
    //   animationType="fade"
    //   transparent={true}
    //   visible={props?.isLoading}
    //   onRequestClose={() => props?.onRequestClose()}
    // >
    //   <View style={style.container}>
    //     <Image style={{ height: 90, width: 90, backgroundColor: colors.modalColor }} source={Icons.CarLogo} />
    //   </View>
    // </Modal>
    <React.Fragment>
      {props?.isLoading ? (
        <View style={style.container1}>
          <Image
            style={{ height: 100, width: 100 }}
            source={AppImages.colonyGif}
          />
        </View>
      ) : null}
    </React.Fragment>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.modalColor,
  },
  container1: {
    flex: 1,
    position: 'absolute',
    top: 0,
    borderRadius: 10,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999999,
  },
});

export default ActivityIndicator;
