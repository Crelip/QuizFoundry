import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

export default function QuizCreation(){
    //Questions and quizare for now a variable, in the future they will be accesssed through an API.
    let quiz = {id: 0, name: "Sample Quiz", owner: 0, firstQuestion: 0};
    let questions = [{id: 0,
        questionText: "Z akej krajiny pochadza mandarinka Darinka?",
        isChoice: true,
        choiceAnswers: ["Grecko", "Spanielsko", "Estonsko", "Portugalsko"],
        correctAnswers: ["Grecko"],
        dynamicNext: true,
        nextQuestion: function(answer) {
            return answer === "Grecko" ? 1 : 2;
        }
    },
    {  
        id: 1,
        questionText: "Kolko dni a noci stravila mandarinka Darinka v tranzite?",
        isChoice: false,
        correctAnswers: ["20"],
        nextQuestion: 3
    },
    {
        id: 2,
        questionText: "Kto sa zalubil do mandarinky Darinky?",
        isChoice: false,
        correctAnswers: ["Jeden pomaranc", "Ovocie"],
        nextQuestion: 3
    },
    {
        id: 3,
        questionText: "O com vedel cely strom?",
        isChoice: true,
        choiceAnswers: ["Ze uz je na svadbu cas", "Ze paraziti napadli strom", "Ze strom niekto ide obrat"],
        correctAnswers: ["Ze uz je na svadbu cas"],
        dynamicNext: false,
        nextQuestion: -1
    }
    ];
    return(
        <div>
            <List>

            </List>
        </div>
    );
}