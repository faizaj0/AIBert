import Navigation from './navigation';
import './components.css';

export default function Help(){
    return(
        <div>
            <Navigation />
            <div>
                <h1 class="faq_title fade_animation"><u>FAQs</u></h1>
                <div class="textbox fade_animation">
                    <div class="queries">
                        <h3>How do I get started with AIbert?</h3>
                        <p>Getting started is simple! Ask AIbert a question such as "What is AI?", and you'll receive definitions and/or course recommendations. You can also access all available courses by pressing the "Courses" at the top of your screen.</p>
                        <h3>How do I get AIbert to recommend me a course?</h3>
                        <p>AIbert can automatically recommend you a course if deemed appropriate. However, you can guarantee a course recommendation by asking for one directly. Try asking AIbert "Give me a course on Artificial Intelligence".</p>
                        <h3>How broad is AIbert?</h3>
                        <p>AIbert is a chatbot that focuses on topics relating to Artificial Intelligence, and currently does not tread far beyond these topics. You can see what topics AIbert has been designed for by viewing the available courses in the "Courses" menu.</p>
                        <h3>Why should I create an account with AIbert?</h3>
                        <p>Creating an account with AIbert will allow your bookmarked courses, completed courses, and learning journeys, to be linked to your account. This means this information will be saved and accessible to you regardless of which device you use AIbert on.</p>
                        <h3>AIbert doesn't respond with what I was expecting. What should I do?</h3>
                        <p>If you have asked a question relating to AI which AIbert was unable to answer, or if AIbert responded incorrectly to a query, feel free to report this to the AIbert development team at 'watsonchatbot11@gmail.com'.</p>
                    </div>
                </div>
            </div>
        </div>

    )
}
