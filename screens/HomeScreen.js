import { View, Text, TouchableOpacity, ScrollView, Platform, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bars3CenterLeftIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline'
import TrendingMovies from '../components/trendingMovies';
import MovieList from '../components/movieList';
import { StatusBar } from 'expo-status-bar';
import { fetchTopRatedMovies, fetchTrendingMovies, fetchUpcomingMovies } from '../api/moviedb';
import { useNavigation } from '@react-navigation/native';
import Loading from '../components/loading';
import { styles } from '../theme';

const ios = Platform.OS === 'ios';

export default function HomeScreen() {

  const [trending, setTrending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();


  useEffect(() => {
    getTrendingMovies();
    getUpcomingMovies();
    getTopRatedMovies();
  }, []);

  const getTrendingMovies = async () => {
    const data = await fetchTrendingMovies();
    console.log('got trending', data.results.length)
    if (data && data.results) setTrending(data.results);
    setLoading(false)
  }
  const getUpcomingMovies = async () => {
    const data = await fetchUpcomingMovies();
    console.log('got upcoming', data.results.length)
    if (data && data.results) setUpcoming(data.results);
  }
  const getTopRatedMovies = async () => {
    const data = await fetchTopRatedMovies();
    console.log('got top rated', data.results.length)
    if (data && data.results) setTopRated(data.results);
  }



  return (
    <View style={localStyles.main}>
      {/* search bar */}
      <SafeAreaView >
        <StatusBar style="light" />
        <View style={localStyles.row}>

          <View style={localStyles.rowfd}>
            <Bars3CenterLeftIcon size="30" strokeWidth={2} color="white" />
            <Text style={localStyles.title}>
              <Text style={styles.text}>M</Text>ovies
            </Text>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <MagnifyingGlassIcon size="30" strokeWidth={2} color="white" />
          </TouchableOpacity>

        </View>
      </SafeAreaView>
      {
        loading ? (
          <Loading />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 10 }}
          >

            {/* Trending Movies Carousel */}
            {trending.length > 0 && <TrendingMovies data={trending} />}

            {/* upcoming movies row */}
            {upcoming.length > 0 && <MovieList title="Upcoming" data={upcoming} />}


            {/* top rated movies row */}
            {topRated.length > 0 && <MovieList title="Top Rated" data={topRated} />}

          </ScrollView>
        )
      }

    </View>



  )
}

const localStyles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#333333"
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '3%',
    marginBottom: Platform.OS == 'ios' ? 0 : 10
  },
  rowfd: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  title: {
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 18,
    color: "#FFFFFF"
  }
})
