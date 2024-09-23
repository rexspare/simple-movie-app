import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import { fallbackPersonImage, image185, image342 } from '../api/moviedb';
var { width, height } = Dimensions.get('window');

export default function Cast({ cast, navigation }) {
    return (
        <View style={{ marginVertical: 10, }}>
            <Text style={localStyles.title}>Top Cast</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 15 }}
            >
                {
                    cast && cast.map((person, index) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => navigation.navigate('Person', person)}
                                style={localStyles.item}>
                                <View
                                    style={localStyles.itemSub}>
                                    <Image
                                        style={localStyles.itemImg}
                                        // source={require('../assets/images/castImage1.png')} 
                                        source={{ uri: image185(person?.profile_path) || fallbackPersonImage }}
                                    />
                                </View>

                                <View>
                                    <Text style={localStyles.character}>
                                        {
                                            person?.character.length > 10 ? person.character.slice(0, 10) + '...' : person?.character
                                        }
                                    </Text>
                                    <Text style={localStyles.person}>
                                        {
                                            person?.original_name.length > 10 ? person.original_name.slice(0, 10) + '...' : person?.original_name
                                        }
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })
                }

            </ScrollView>

        </View>
    )
}

const localStyles = StyleSheet.create({
    title: {
        color: 'white',         // Equivalent to text-white
        fontSize: 18,           // Approximately equivalent to text-lg (18px)
        marginHorizontal: 16,    // Equivalent to mx-4 (16px on left and right)
        marginBottom: 20,
    },
    item: {
        flexDirection: 'row',    // Use row direction if you have multiple items
        alignItems: 'center',     // Equivalent to items-center
        marginRight: 16,
    },
    itemSub: {
        overflow: 'hidden',             // Equivalent to overflow-hidden
        borderRadius: 50,               // Equivalent to rounded-full (fully rounded)
        height: 80,                     // Equivalent to h-20 (80px)
        width: 80,                      // Equivalent to w-20 (80px)
        alignItems: 'center',           // Equivalent to items-center
        borderWidth: 1,                 // Equivalent to border
        borderColor: '#A0AEC0',
    },
    itemImg: {
        borderRadius: 16,  // Equivalent to rounded-2xl (16px)
        height: 96,        // Equivalent to h-24 (96px)
        width: 80,
    },
    character: {
        color: 'white',        // Equivalent to text-white
        fontSize: 12,          // Approximately equivalent to text-xs (12px)
        marginHorizontal: 5,
    },
    person: {
        color: '#A0AEC0',     // Equivalent to text-neutral-400
        fontSize: 12,
        marginHorizontal: 5,
    }
})