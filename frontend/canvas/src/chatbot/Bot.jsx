import {useState} from "react";

function Bot() {
    const [message, setMessage] = useState('');
    const [alertTime, setAlertTime] = useState('');
    const [eventName, setEventName] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [filteringWord, setFilteringWord] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            message,
            alert_time: alertTime,
            event_name: eventName,
            event_description: eventDescription,
            event_time: eventTime,
            filtering_word: filteringWord
        };

        try {
            const response = await fetch(`/workspaces/1/conversations/1/bot`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert('Bot created successfully');
            } else {
                alert('Failed to create bot');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-md w-full max-w-lg mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create Bot</h2>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">메시지</label>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Alert Time</label>
                <input
                    type="text"
                    value={alertTime}
                    onChange={(e) => setAlertTime(e.target.value)}
                    placeholder="Enter alert time"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Event Name</label>
                <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="Enter event name"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Event Description</label>
                <input
                    type="text"
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    placeholder="Enter event description"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Event Time</label>
                <input
                    type="text"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    placeholder="Enter event time"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Filtering Word</label>
                <input
                    type="text"
                    value={filteringWord}
                    onChange={(e) => setFilteringWord(e.target.value)}
                    placeholder="Enter filtering word"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                />
            </div>

            <button
                type="submit"
                className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
                Create Bot
            </button>
        </form>
    );
}

export default Bot;