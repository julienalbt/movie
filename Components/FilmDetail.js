// Components/FilmDetail.js

import React from 'react'
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, Image } from 'react-native'
import { getFilmDetailFromApi } from '../API/TMDBApi'
import { getImageFromAPI } from '../API/TMDBApi'
import Moment from 'moment'
import numeral from 'numeral'

class FilmDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      film: undefined, // Pour l'instant on n'a pas les infos du film, on initialise donc le film à undefined.
      isLoading: true // A l'ouverture de la vue, on affiche le chargement, le temps de récupérer le détail du film
    }
  }

  _displayLoading() {
    if (this.state.isLoading) {
      // Si isLoading vaut true, on affiche le chargement à l'écran
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size='large' />
        </View>
      )
    }
  }

  componentDidMount() {
    getFilmDetailFromApi(this.props.navigation.state.params.idFilm).then(data => {
      this.setState({
        film: data,
        isLoading: false
      })
    })
}

_displayFilm() {
  const {film} = this.state
  if (this.state.film != undefined) {
    return (
      <ScrollView style={styles.scrollview_container}>
        <Image
          style={styles.cover}
          source={{uri: getImageFromAPI(film.backdrop_path)}}
        />
        <View style={styles.contentContainer}>
            <Text style={styles.titleText}>{film.title}</Text>
          <View style={styles.descriptionContainer}>
            <Text style={styles.descText}>{film.overview}</Text>
          </View>
          <View style={styles.info}>
            <Text>Sorti le {Moment(film.release_date).format('DD/MM/YYYY')}</Text>
            <Text>Note : {film.vote_average} /10</Text>
            <Text>Nombre de vote : {film.vote_count}</Text>
            <Text>Budget : {numeral(film.budget).format('0,0')} $</Text>
            <Text>Genre(s) : {film.genres.map(function(genre){
              return genre.name;
            }).join(" / ")}</Text>
            <Text>Companie(s) : {film.production_companies.map(function(companie){
              return companie.name;
            }).join(" / ")}</Text>
          </View>
        </View>
      </ScrollView>
    )
  }
}

  render() {
    Moment.locale('fr');
    return (
      <View style={styles.main_container}>
        {this._displayLoading()}
        {this._displayFilm()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1
  },
  loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollview_container: {
    flex: 1
  },
  cover: {
    height: 190
  },
  contentContainer: {
    flex: 1
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 30,
    margin: 10,
    textAlign: 'center',
    flexWrap: 'wrap'
  },
  descriptionContainer: {
    margin: 15,
    flex: 1
  },
  descText: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#757575'
  },
  info: {
    margin: 15
  }
})

export default FilmDetail