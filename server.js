require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const mongoose = require('mongoose');
const User = require('./models/user');
const path = require('path');
const fs = require('fs');

// Initialize Express
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB подключен'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'some random secret',
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.serializeUser((user, done) => {
    done(null, user.discordId);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findOne({ discordId: id });
        done(null, user);
    } catch (err) {
        done(err);
    }
});

passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/callback',
    scope: ['identify', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const userData = {
            discordId: profile.id,
            username: profile.username,
            discriminator: profile.discriminator,
            avatar: profile.avatar,
            email: profile.email // Save email
        };

        let user = await User.findOne({ discordId: profile.id });

        if (!user) {
            user = await User.create(userData);
        } else {
            user.email = profile.email; // Update email if changed
            await user.save();
        }

        done(null, user);
    } catch (err) {
        done(err);
    }
}));

// Routes
app.get('/login', passport.authenticate('discord'));

app.get('/callback', passport.authenticate('discord', {
    failureRedirect: '/',
    successRedirect: '/create-profile'
}));

app.get('/create-profile', (req, res) => {
    if (req.isAuthenticated()) {
        const username = req.user.username;
        const email = req.user.email; // Get email from the user object
        const profilePath = path.join(__dirname, 'profiles');
        const profileFilename = `${username}.html`;
        const profileFilePath = path.join(profilePath, profileFilename);

        if (!fs.existsSync(profilePath)) {
            fs.mkdirSync(profilePath);
        }

 
const htmlContent = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${username} | UshankaCraft</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;800;900&amp;display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/profile.css">
    <link rel="icon" href="/public/images/favicon.png" type="image/x-icon">
    <script src="/js/jquery-latest.js" type="text/javascript"></script>
    <script type="text/javascript" src="/js/jquery.min.js"></script>
    <script src="/js/aos.js"></script>
</head>
<body>
    <header class="header">
        <nav>
            <div class="logotype">
                <img src="/images/logo.png" alt="Logo">
            </div>
            <input type="checkbox" id="menu-toggle">
            <label for="menu-toggle" class="menu-icon">&#9776;</label>
            <ul class="menu">
                <li><a href="/index.html">Главная</a></li>
                <li><a href="/about.html">О сервере</a></li>
                <li><a href="/rules.html">Правила</a></li>
                <li><a href="https://minecraft.ushnka.online">Донат</a></li>
            </ul>
            <i class="fas fa-moon"></i>
            <button id="login-button" class="random-button">
                <i class="fab fa-discord"></i>
            </button>
            <div id="logo-info"></div>
        </nav>
    </header>
    <div id="modal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <p>Войдите, используя Ваш Discord, для получения к полному функционалу сайта</p>
            <a href="/login" class="button" id="login-button"><i class="fa-brands fa-discord"></i> Войти</a>
        </div>
    </div>

    <!-- User Info Modal -->
    <div id="user-modal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <div id="user-details"></div>
            
            
            
        </div>
    </div>

    <section class="profile">
        <h1>Профиль ${username}</h1>
        <div id="users-info">
            <img src="https://cdn.discordapp.com/avatars/${req.user.discordId}/${req.user.avatar}.png" alt="${username}">
            <p>ID: ${req.user.discordId}</p>
            <p>Зарегистрирован: ${new Date(req.user.createdAt).toLocaleDateString()}</p>
            <p id="date">E-Mail: ${email}</p>
             <div id="social-links">
                ${req.user.socialLinks.telegram ? `<a href="${req.user.socialLinks.telegram}" class="social-icon"><i class="fab fa-telegram"></i></a>` : ''}
                ${req.user.socialLinks.instagram ? `<a href="${req.user.socialLinks.instagram}" class="social-icon"><i class="fab fa-instagram"></i></a>` : ''}
                ${req.user.socialLinks.youtube ? `<a href="${req.user.socialLinks.youtube}" class="social-icon"><i class="fab fa-youtube"></i></a>` : ''}
                ${req.user.socialLinks.twitch ? `<a href="${req.user.socialLinks.twitch}" class="social-icon"><i class="fab fa-twitch"></i></a>` : ''}
            </div>
            <div id="logout"></div>
           
            
        </div>
    </section>

    <div id="modal-2" class="modal-2">
        <div class="modal-content-2">
            <span class="close-2">&times;</span>
            <form id="social-form">
                <label for="social-link">Введите ссылку:</label>
                <input type="url" id="social-link" name="link" required>
                <input type="hidden" id="social-platform" name="platform">
                <button type="submit">Привязать</button>
            </form>
            
            <h2>Внимание!</h2>
            <p>При добавлении или изменении ссылки Вам необходимо перезайти в аккаунт</p>
        </div>
    </div>
    <!-- Delete Account Confirmation Modal -->
<div id="modal-3" class="modal-3">
        <div class="modal-content-3">
            <span class="close-3">&times;</span>
            <p>Точно ли, вы хотите удалить аккаунт?</p>
            <button id="confirm-delete" class="button">Да</button>
            <button id="cancel-delete" class="button">Нет</button>
        </div>
    </div>



    <script src="/profile.js">
       
    </script>

    <script src="https://kit.fontawesome.com/cc4d02473d.js" crossorigin="anonymous"></script>
</body>
</html>

`;



        fs.writeFile(profileFilePath, htmlContent, (err) => {
            if (err) {
                console.error('Error creating profile file:', err);
                res.status(500).send('Internal Server Error');
            } else {
                res.redirect(`../profiles/${profileFilename}`);
            }
        });
    } else {
        res.redirect('/');
    }
});

app.get('/profiles/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'profiles', req.params.filename);
    if (fs.existsSync(filePath)) {
        fs.readFile(filePath, 'utf8', async (err, data) => {
            if (err) {
                console.error('Error reading profile file:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            let userIdMatch = data.match(/ID: (\d+)/);
            let profileOwnerId = userIdMatch ? userIdMatch[1] : null;

            if (req.isAuthenticated() && req.user.discordId === profileOwnerId) {
                // Add the logout button and social media link buttons if the user is viewing their own profile
                data = data.replace('<div id="logout">', `
                    <div id="logout">
                    <div class="social-buttons">
                            <button class="social-button" data-platform="telegram">Привязать Telegram</button>
                            <button class="social-button" data-platform="instagram">Привязать Instagram</button>
                            <button class="social-button" data-platform="youtube">Привязать YouTube</button>
                            <button class="social-button" data-platform="twitch">Привязать Twitch</button>
                        </div>
                        <a id="logout-button" href="/logout">Выйти</a>
                        <button id="delete-account-button" class="button">Удалить аккаунт</button>
                        
                    </div>
                `);
                
            }

            res.send(data);
        });
    } else {
        res.redirect('404.html');
    }
});


app.get('/api/user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user);
    } else {
        res.sendStatus(401);
    }
});

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).send('Logout error');
        }
        res.redirect('/');
    });
});


app.post('/api/social-link', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).send('Not authenticated');
    }

    const { platform, link } = req.body;

    // Validate platform
    if (!['telegram', 'instagram', 'youtube', 'twitch'].includes(platform)) {
        return res.status(400).send('Invalid platform');
    }

    // Validate link format
    const linkPatterns = {
        telegram: /^https:\/\/t\.me\/.+$/,
        instagram: /^https:\/\/www\.instagram\.com\/.+$/,
        instagram: /^https:\/\/instagram\.com\/.+$/,
        instagram: /^https:\/\/www\.instagram\.com\/.+$/,
        youtube: /^https:\/\/youtube\.com\/channel\/.+$/,
        youtube: /^https:\/\/youtube\.com\/.+$/,
        youtube: /^https:\/\/www\.youtube\.com\/channel\/.+$/,
        youtube: /^https:\/\/www\.youtube\.com\/.+$/,
        twitch: /^https:\/\/twitch\.tv\/.+$/,
        twitch: /^https:\/\/www\.twitch\.tv\/.+$/,

       
    };

    if (!linkPatterns[platform].test(link)) {
        return res.status(400).send('Invalid link format');
    }

    try {
        const user = await User.findOne({ discordId: req.user.discordId });
        user.socialLinks = user.socialLinks || {};
        user.socialLinks[platform] = link;
        await user.save();

        const result = { platform, link };
        res.status(200).json(result);
    } catch (err) {
        console.error('Error updating social link:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/api/delete-account', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).send('Not authenticated');
    }

    const user = req.user;
    if (!user || !user.username) {
        return res.status(400).send('User not found');
    }

    try {
        // Удаление пользователя из базы данных
        await User.deleteOne({ discordId: user.discordId });

        // Завершаем сеанс пользователя
        req.logout(err => {
            if (err) {
                return res.status(500).send('Logout error');
            }

            // Удаление HTML-файла профиля
            const profilePath = path.join(__dirname, 'profiles');
            const profileFilename = `${user.username}.html`;
            const profileFilePath = path.join(profilePath, profileFilename);

            if (fs.existsSync(profileFilePath)) {
                fs.unlink(profileFilePath, (err) => {
                    if (err) {
                        console.error('Error deleting profile file:', err);
                        return res.status(500).send('Internal Server Error');
                    }
                    // Удаляем сессию
                    req.session.destroy(err => {
                        if (err) {
                            return res.status(500).send('Session destruction error');
                        }
                        res.status(200).send('Account deleted');
                    });
                });
            } else {
                // Удаляем сессию, если файл не существует
                req.session.destroy(err => {
                    if (err) {
                        return res.status(500).send('Session destruction error');
                    }
                    res.status(200).send('Account deleted');
                });
            }
        });
    } catch (err) {
        console.error('Error deleting account:', err);
        res.status(500).send('Internal Server Error');
    }
});





app.use(express.static(path.join(__dirname, 'public')));

// Serve CSS files
app.use('/profiles', express.static(path.join(__dirname, 'profiles')));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Сервер успешно запущен! Порт: ${PORT}`);
});
