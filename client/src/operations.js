export async function serverGetToken(username, password) {
    const data = {
        username: username,
        password: password
    }
    const res = await fetch('http://localhost:5000/api/Tokens', {
        'method': 'post',
        'headers': {
            'Content-Type': 'application/json',
        },
        'body': JSON.stringify(data)
    })

    if (!res.ok) {
        return "";
    }
    const token = await res.text()
    return token;
}

export async function serverGetContactList(token) {
    const res = await fetch('http://localhost:5000/api/Chats', {
        'method': 'get',
        'headers': {
            'Content-Type': 'application/json',
            'authorization': 'bearer ' + token
        }
    });

    // Show the server's response    
    if (!res.ok) {
        return "";
    }

    const body = await res.text()
    const json_object = JSON.parse(body)
    const result = json_object.map((item) => {
        const id = item.id;
        const { username, displayName, profilePic } = item.user;
        var { created, content } = { created: "", content: "now!" };
        var date = "empty chat"
        var hour = "click the button to chat"
        var lastMessageView = "now!"
        if (item.lastMessage != null) {
            ({ created, content } = item.lastMessage);
            let hourMinus3 = created.substring(11, 13)
            let num = parseInt(hourMinus3);
            num = (num + 3) % 24;
            const updatedHour = String(num) + created.substring(13, 16)
            date = created.substring(0, 10)
            hour = updatedHour
            lastMessageView = content.length > 15? (content.substring(0,15) + "..."): content
        }
        return {
            username,
            id: id,
            displayName,
            image: profilePic,
            date: date,
            hour: hour,
            lastMessage: lastMessageView
        };
    });

    return result.reverse()
}

export async function serverGetMessages(token, id, username) {
    const res = await fetch('http://localhost:5000/api/Chats/' + id + '/Messages', {
        'method': 'get',
        'headers': {
            'Content-Type': 'application/json',
            'authorization': 'bearer ' + token
        }
    });

    // Show the server's response    
    if (!res.ok) {
        return [];
    }

    const body = await res.text()
    const json_object = JSON.parse(body)
    const reversedMessages = json_object.reverse()
    const result = reversedMessages.map((item) => {
        const date = new Date(item.created);
        const time = date.toISOString().split("T")[0] + ' ' + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        var who = "me"
        if (item.sender.username === username) {
            who = "other"
        }
        return {
            content: item.content,
            hour: time,
            who: who
        };
    });

    return result
}

export async function serverSendMessage(token, id, msg) {
    const data = {
        msg: msg
    }
    const res = await fetch('http://localhost:5000/api/Chats/' + id + '/Messages', {
        'method': 'post',
        'headers': {
            'Content-Type': 'application/json',
            'authorization': 'bearer ' + token
        },

        'body': JSON.stringify(data)
    });

    // Show the server's response    
    if (!res.ok) {
        console.log("error")
        return false
    }

    return true
}

export async function serverAddChat(token, username) {
    const data = {
        username: username
    }
    const res = await fetch('http://localhost:5000/api/Chats', {
        'method': 'post',
        'headers': {
            'Content-Type': 'application/json',
            'authorization': 'bearer ' + token
        },

        'body': JSON.stringify(data)
    });

    // Show the server's response    
    if (!res.ok) {
        return await res.text()
    }

    return ""
}

export async function serverRegisterAccount(username, password, displayName, profilePic) {
    const data = {
        username: username,
        password: password,
        displayName: displayName,
        profilePic: profilePic
    }
    const res = await fetch('http://localhost:5000/api/Users', {
        'method': 'post',
        'headers': {
            'Content-Type': 'application/json',
        },
        'body': JSON.stringify(data)
    })

    if (res.ok) {
        return true;
    }
    return false;
}

export async function serverGetAcountInfo(token, username) {
    const res = await fetch('http://localhost:5000/api/Users/' + username, {
        'method': 'get',
        'headers': {
            'Content-Type': 'application/json',
            'authorization': 'bearer ' + token
        },

    });

    // Show the server's response    
    if (!res.ok) {
        console.log(await res.text())
        console.log("error")
        return []
    }


    return JSON.parse(await res.text())
}

