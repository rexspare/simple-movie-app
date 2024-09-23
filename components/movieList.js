import { View, Text, ScrollView, TouchableWithoutFeedback, Image, Dimensions, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { moviesData } from '../constants'
import { useNavigation } from '@react-navigation/native';
import { fallbackMoviePoster, image185, image342, poster342 } from '../api/moviedb';
import { styles } from '../theme';
const { width, height } = Dimensions.get('window');

export default function MovieList({ title, hideSeeAll, data }) {
  const navigation = useNavigation();
  return (
    <View style={{
      marginVertical: 16
    }}>

      <View style={localStyles.container}>
        <Text style={localStyles.title}>{title}</Text>
        {
          !hideSeeAll && (
            <TouchableOpacity>
              <Text style={[styles.text, localStyles.seeAll]}>See All</Text>
            </TouchableOpacity>
          )
        }


      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
      >
        {
          data.map((item, index) => {
            return (
              <TouchableWithoutFeedback
                key={index}
                onPress={() => navigation.push('Movie', item)}
              >
                <View style={{ marginRight: 10 }}>
                  <Image
                    // source={require('../assets/images/moviePoster2.png')}
                    source={{ uri: image185(item.poster_path) || fallbackMoviePoster }}
                    style={localStyles.image}
                  />
                  <Text style={localStyles.itemTxt}>
                    {
                      item.title.length > 14 ? item.title.slice(0, 14) + '...' : item.title
                    }
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            )
          })
        }
      </ScrollView>
    </View>
  )
}

const localStyles = StyleSheet.create({
  title: {
    color: "#FFFFFF",
    marginBottom: 10,
    fontSize: 18,
    marginHorizontal: 10,
    fontWeight: 'bold'
  },
  seeAll: {
    marginBottom: 10,
    fontSize: 18,
  },
  image: {
    borderRadius: 24,
    width: width * 0.33,
    height: height * 0.22
  },
  container: {
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTxt: {
    color: '#D1D5DB',
    marginLeft: 4,
    marginTop: 5
  }
})