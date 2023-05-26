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
    // console.log(body);
    const json_object = JSON.parse(body)
    // console.log("json: " + JSON.stringify(json_object))
    const result = json_object.map((item) => {
        const id = item.id;
        const { username, displayName, profilePic } = item.user;
        var { created, content } = { created: "", content: "now!" };
        var date = "empty chat"
        var hour = "click the button to chat"
        if (item.lastMessage != null) {
            ({ created, content } = item.lastMessage);
            // console.log(created.substring(0, 10))
            date = created.substring(0, 10)
            // console.log(created.substring(11, 16))
            hour = created.substring(11, 16)
        }

        // console.log(displayName)
        // console.log(date.toISOString().split("T")[0])
        return {
            username,
            id: id,
            displayName,
            image: profilePic,
            date: date,
            hour: hour,
            lastMessage: content
        };
    });

    // console.log(JSON.stringify(result))
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

    // console.log(res)
    const body = await res.text()
    // console.log(body)
    const json_object = JSON.parse(body)
    const reversedMessages = json_object.reverse()
    const result = reversedMessages.map((item) => {
        const date = new Date(item.created);
        const time = date.toISOString().split("T")[0] + ' ' + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        var who = "me"
        // console.log("item username: " + item.sender.username)
        // console.log("username: " + username)
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

    // console.log(await res.text())
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

    // console.log("good")
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
        console.log("new account!")
        console.log(JSON.stringify(await res.text()))
        return true;
    }

    console.log("already registered")
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

