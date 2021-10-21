import React, { useState, useEffect } from "react";
import { View, FlatList, Text } from "react-native";
import { Appbar, Button, Card } from "react-native-paper";
import firebase from "firebase/app";
import "firebase/firestore";
import { SocialModel } from "../../../../models/social.js";
import { styles } from "./FeedScreen.styles";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../MainStackScreen.js";
import { grey100 } from "react-native-paper/lib/typescript/styles/colors";

/* 
  Remember the navigation-related props from Project 2? They were called `route` and `navigation`,
  and they were passed into our screen components by React Navigation automatically.  We accessed parameters 
  passed to screens through `route.params` , and navigated to screens using `navigation.navigate(...)` and 
  `navigation.goBack()`. In this project, we explicitly define the types of these props at the top of 
  each screen component.

  Now, whenever we type `navigation.`, our code editor will know exactly what we can do with that object, 
  and it'll suggest `.goBack()` as an option. It'll also tell us when we're trying to do something 
  that isn't supported by React Navigation!
*/
interface Props {
  navigation: StackNavigationProp<MainStackParamList, "FeedScreen">;
}

export default function FeedScreen({ navigation }: Props) {
  // List of social objects
  const [socials, setSocials] = useState<SocialModel[]>([]);

  const currentUserId = firebase.auth().currentUser!.uid;

  useEffect(() => {
    const db = firebase.firestore();
    const unsubscribe = db
      .collection("socials")
      .orderBy("eventDate", "asc")
      .onSnapshot((querySnapshot: any) => {
        var newSocials: SocialModel[] = [];
        querySnapshot.forEach((social: any) => {
          const newSocial = social.data() as SocialModel;
          newSocial.id = social.id;
          newSocials.push(newSocial);
        });
        setSocials(newSocials);
      });
    return unsubscribe;
  }, []);

  const toggleInterested = (social: SocialModel) => {
    // TODO: Put your logic for flipping the user's "interested"
    // status here, and call this method from your "like"
    // button on each Social card.
    let newInterested: String[] = [...social.interested];
    if (newInterested.includes(currentUserId)) {
      newInterested.splice(social.interested.indexOf(currentUserId), 1);
    } else {
      newInterested = [...newInterested, currentUserId];
    }
    firebase.firestore().collection("socials").doc(social.id).update({
      interested: newInterested,
    });
  };

  const deleteSocial = (social: SocialModel) => {
    // TODO: Put your logic for deleting a social here,
    // and call this method from your "delete" button
    // on each Social card that was created by this user.
    if (currentUserId === social.creatorID) {
      const db = firebase.firestore();
      db.collection("socials")
        .doc(social.id)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    }
  };

  const renderSocial = ({ item }: { item: SocialModel }) => {
    const onPress = () => {
      navigation.navigate("DetailScreen", {
        social: item,
      });
    };

    const includes = item.interested.includes(currentUserId);
    return (
      <Card onPress={onPress} style={{ margin: 16 }}>
        <Card.Cover source={{ uri: item.eventImage }} />
        <Card.Title
          title={item.eventName}
          subtitle={
            item.eventLocation +
            " • " +
            new Date(item.eventDate).toLocaleString()
          }
        />
        {/* TODO: Add a like/interested button & delete soccial button. See Card.Actions
              in React Native Paper for UI/UX inspiration.
              https://callstack.github.io/react-native-paper/card-actions.html */}
        <Card.Actions>
          <Button
            icon={includes ? "heart" : "heart-outline"}
            onPress={() => toggleInterested(item)}
          >
            {includes ? "Liked" : "Like"} {`(${item.interested.length})`}
          </Button>
          <Button onPress={() => deleteSocial(item)}>Delete</Button>
        </Card.Actions>
      </Card>
    );
  };

  const Bar = () => {
    return (
      <Appbar.Header>
        <Appbar.Action
          icon="exit-to-app"
          onPress={() => firebase.auth().signOut()}
        />
        <Appbar.Content title="Socials" />
        <Appbar.Action
          icon="plus"
          onPress={() => {
            navigation.navigate("NewSocialScreen");
          }}
        />
      </Appbar.Header>
    );
  };

  const ListEmptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={[styles.body, { color: "#808080" }]}>
          Welcome! To get started, use the plus button in the top-right corner
          to create a new social.
        </Text>
      </View>
    );
  };
  return (
    <>
      <Bar />
      <View style={styles.container}>
        <FlatList
          data={socials}
          renderItem={renderSocial}
          keyExtractor={(_: any, index: number) => "key-" + index}
          // TODO: Uncomment the following line, and figure out how it works
          // by reading the documentation :)
          // https://reactnative.dev/docs/flatlist#listemptycomponent

          ListEmptyComponent={ListEmptyComponent}
        />
      </View>
    </>
  );
}
