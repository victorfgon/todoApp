import React from 'react';
import { 
    StyleSheet, 
    Text, 
    View,
    ScrollView,
    TouchableOpacity,
    AsyncStorage,
    Image,
    
} from 'react-native';

import Config from './src/Config';
import Header from './src/components/Header';
import Footer from './src/components/Footer';





/**
 * App
 *
 * Root component for the application.
 * Handles logic for adding and removing notes.
 */
export default class App extends React.Component {

    /**
     * constructor
     *
     * @array   notes   all added notes.
     * @string  note    the current note value.
     */
    constructor(props) {
        super(props);
        this.state = {
            notes: [],
            note: '',
            done: [],
        }

    }

    /**
     * componentDidMount
     *
     * Load notes from asyncstorage if exists
     */
    async componentDidMount() {

        const notes = await AsyncStorage.getItem('notes');
        if (notes && notes.length > 0) {
            this.setState({
                notes: JSON.parse(notes)
            })
        }
        const done = await AsyncStorage.getItem('done');
        if (done && done.length > 0) {
            this.setState({
                done: JSON.parse(done)
            })
        }

    }

    /**
     * updateAsyncStorage
     *
     * @array   notes   notes array to save in asyncstorage
     *
     * @return  promise
     */
    updateAsyncStorage(notes,done) {

        return new Promise( async(resolve, reject) => {

            try {

                await AsyncStorage.removeItem('notes');
                await AsyncStorage.setItem('notes', JSON.stringify(notes));
                await AsyncStorage.removeItem('done');
                await AsyncStorage.setItem('done', JSON.stringify(done));
                return resolve(true);

            } catch(e) {
                return reject(e);
            }

        });

    }

    /**
     * cloneNotes
     *
     * Creates a shallow copy of the state notes array
     *
     * @return   @array  cloned notes array
     */
    cloneNotes() {
        return [...this.state.notes];
    }

    cloneDone() {
        return [...this.state.done];
    }

    /**
     * addNote
     *
     * Adds new note.
     *
     * @return  undefined
     */
    async addNote() {

        if (this.state.note.length <= 0)
            return;

        try {

            const notes = this.cloneNotes();
            notes.push(this.state.note);

            const done = this.cloneDone();
            done.push(0);

            await this.updateAsyncStorage(notes,done);

            this.setState({
                notes: notes,
                note: '',
                done:done,
            });

        }

        catch(e) {

            // notes could not be updated
            alert(e);

        }

    }

    /**
     * removeNote
     *
     * Removes note based on array index.
     *
     * @return  undefined
     */
    async removeNote(i) {

        try {

            const notes = this.cloneNotes();
            const done = this.cloneDone();
            notes.splice(i, 1);
            done.splice(i, 1);

            await this.updateAsyncStorage(notes,done);
            this.setState({ notes: notes, done:done });

        }

        catch(e) {

            // Note could not be deleted
            alert(e);

        }

    }


    async changeColor(i) {
        try {

        var done = this.cloneDone();
        if(done[i]==0){
        done[i]=1;
        }
        else if(done[i]==1){
            done[i]=0;
        }
        this.setState({ done:done });
        await this.updateAsyncStorage(this.state.notes,done);
        }

        catch(e) {

            
            alert(e);

        }
    }

    /**
     * renderNotes
     *
     * Renders all notes in note array in a map.
     *
     * @return  Mapped notes array
     */
    renderNotes() {
        
        return this.state.notes.map((note, i) => {
            
            if(this.state.done[i]==0){
            return (
                <TouchableOpacity 
                    key={i} style={styles.note} 
                    onPress={ () => this.changeColor(i) }
                    
                >
                    <Text style={styles.x} onPress={ () => this.removeNote(i) }>
                        X
                    </Text>
                    <Text style={styles.noteText}>{note}</Text>
                </TouchableOpacity>
            );
            }

            if(this.state.done[i]==1){
                return (
                    <TouchableOpacity 
                        key={i} style={styles.noteg} 
                        onPress={ () => this.changeColor(i) }
                        
                    >
                        <Image style={styles.img} source={require('./assets/pngegg.png')}/>
                        <Text style={styles.x} onPress={ () => this.removeNote(i) }>
                            X
                        </Text>
                        <Text style={styles.noteTextg}>{note}</Text>
                    </TouchableOpacity>
                );
                }
        });
    

    
    }
    

    render() {

        return (
            <View style={styles.container}>

                <Header title={Config.title} />

                <ScrollView style={styles.scrollView}>
                    {this.renderNotes()}
                </ScrollView>

                <Footer
                    onChangeText={ (note) => this.setState({note})  }
                    inputValue={this.state.note}
                    onNoteAdd={ () => this.addNote() }
                />

            </View>
        );

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative'
    },
    scrollView: {
        maxHeight: '82%',
        marginBottom: 100,
        backgroundColor: '#fff'
    },
    note: {
        margin: 20,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        backgroundColor: '#f9f9f9',
        borderColor: '#ddd',
        borderRadius: 10,
         
    },
    noteg: {
        margin: 20,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        backgroundColor: '#90EE90',
        borderColor: '#ddd',
        borderRadius: 10,
        
    },
    noteTextg: {
        fontSize: 20,
        padding: 10,
        textDecorationLine: 'line-through', 
        textDecorationStyle: 'solid',
    },

    noteText: {
        fontSize: 20,
        padding: 10,
    },

    x: {
       
        color:'red',
        left: 200,    
        width: 100,
        alignItems: 'flex-start',
        position: 'relative',
        fontSize: 20,
    },

    img: {
        width: 20,
        height: 20,
        left: -150,
        
    }
});