
import { View , Text , StyleSheet, StatusBar , Image ,TextInput} from 'react-native';

   
//styleSeet c quoi" class, api ,interface ,..etc "" !! obj js rep les styles qu on applique 
//methode create : creer obj contient les styles !!
export default function App(){
    return (
        <View style={{flex: 1, justifyContent: 'flex-end', flexDirection: 'row'}}>
        
          <View style={{width: 50, backgroundColor: 'powderblue'}} >
             <Text>
                ♥♥♥
                hey
                hey
                ♦♣♠
             </Text>
          </View>
          <View style={{width: 50,backgroundColor: 'skyblue'}} > 
               <Text>♥♥♥</Text>
          </View>
          <View style={{width: 50,backgroundColor: 'steelblue'}} >
               <Text>♥♥♥</Text>
          </View>
           <StatusBar style="auto"/>
          
        </View>

    );
}
const styles =StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#fffde4',
  alignItems: 'center',

 
},

    textstyle : {
        fontSize : 27,
        color: 'red'
    },

    Imagestyle: {
         width:200,
         height:100
    }
});