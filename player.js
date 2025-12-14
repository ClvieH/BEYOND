

    document.addEventListener('DOMContentLoaded', function() {
        // 播放器核心元素
        const playBtn = document.querySelector('.play-btn');
        const playIcon = playBtn.querySelector('i');
        const progressBar = document.querySelector('.progress');
        const progressHandle = document.querySelector('.progress-handle');
        const currentTimeDisplay = document.getElementById('timeCurrent');
        const totalTimeDisplay = document.getElementById('timeTotal');
        const speedDisplay = document.querySelector('.speed-display');
        const speedDownBtn = document.querySelectorAll('.speed-btn')[0];
        const speedUpBtn = document.querySelectorAll('.speed-btn')[1];
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        const playlistBtn = document.getElementById('playlistBtn');
        const closePlaylistBtn = document.getElementById('closePlaylist');
        const playlistPanel = document.getElementById('playlistPanel');
        const playlistContainer = document.getElementById('playlist');
        const loadingIndicator = document.getElementById('loadingIndicator');
        
        // 新增元素
        const modeControl = document.getElementById('modeControl');
        const modeIcon = modeControl.querySelector('i');
        const lyricsBtn = document.getElementById('lyricsBtn');
        const coverSection = document.getElementById('coverSection');
        const lyricsDisplay = document.getElementById('lyricsDisplay');
        const coverImage = document.getElementById('coverImage');
        const coverFallback = document.getElementById('coverFallback');
        const fallbackTitle = document.getElementById('fallbackTitle');
        const fallbackArtist = document.getElementById('fallbackArtist');
        const songTitle = document.getElementById('songTitle');
        const songArtist = document.getElementById('songArtist');
        const albumInfo = document.getElementById('albumInfo');
        
        // 音频控制元素
        const volumeSliderContainer = document.getElementById('volumeSlider');
        const volumeSlider = document.querySelector('.volume-slider');
        const volumeHandle = document.querySelector('.volume-handle');
        const volumeIcon = document.querySelector('.volume-icon i');
        
        // 音频播放器
        const audioPlayer = document.getElementById('audioPlayer');
        
        // 播放状态
        let isPlaying = false;
        let currentTime = 0;
        let currentSpeed = 1.0;
        let currentVolume = 0.8;
        
        // 歌词显示状态
        let showLyrics = false;
        
        // 播放模式：0-列表循环，1-随机播放，2-单曲循环
        let playMode = 0;
        const playModes = [
            { icon: 'fa-redo', text: '列表循环' },
            { icon: 'fa-random', text: '随机播放' },
            { icon: 'fa-retweet', text: '单曲循环' }
        ];
        
        // 当前播放的歌曲索引
        let currentSongIndex = 0;
        let totalTime = 323; // 默认时长（灰色轨迹）
        
        // 歌词相关
        let currentLyrics = [];
        
        // 解析LRC歌词格式
        function parseLRC(lrcText) {
            const lines = lrcText.split('\n');
            const lyrics = [];
            
            lines.forEach(line => {
                // 匹配LRC格式的时间标签，如[00:16.360]
                const timeMatch = line.match(/\[(\d{2}):(\d{2}\.\d{2,3})\](.*)/);
                
                if (timeMatch) {
                    const minutes = parseFloat(timeMatch[1]);
                    const seconds = parseFloat(timeMatch[2]);
                    const text = timeMatch[3].trim();
                    
                    // 过滤空文本和包含"作词"、"作曲"等信息的行
                    if (text && !text.includes('作词 :') && !text.includes('作曲 :') && 
                        !text.includes('编曲 :') && !text.includes('监制 :') && 
                        text !== '') {
                        const time = minutes * 60 + seconds;
                        lyrics.push({ time, text });
                    }
                }
            });
            
            // 按时间排序
            lyrics.sort((a, b) => a.time - b.time);
            return lyrics;
        }
        
        // 灰色轨迹的LRC歌词
        const greyTrackLRC = `[00:00.000] 作词 : 刘卓辉
[00:00.666] 作曲 : 黄家驹
[00:01.332] 编曲 : Beyond
[00:02.000] 编曲 : Beyond
[00:03.000]
[00:16.360] 酒一再沉溺
[00:19.200] 何时麻醉我抑郁
[00:23.394] 过去了的一切会平息
[00:29.723] 冲不破墙壁
[00:32.560] 前路没法看得清
[00:36.748] 再有那些挣扎与被迫
[00:43.856] 踏着灰色的轨迹
[00:50.532] 尽是深渊的水影
[00:56.784] 我已背上一身苦困后悔与唏嘘
[01:03.453] 你眼里却此刻充满泪
[01:10.074] 这个世界已不知不觉地空虚
[01:15.933] Wo 不想你别去
[01:23.038] 心一再回忆
[01:25.873] 谁能为我去掩饰
[01:30.117] 到哪里都跟你要认识
[01:36.400] 洗不去痕迹
[01:39.324] 何妨面对要可惜
[01:43.460] 各有各的方向与目的
[01:50.615] 踏着灰色的轨迹
[01:57.226] 尽是深渊的水影
[02:03.444] 我已背上一身苦困后悔与唏嘘
[02:10.139] 你眼里却此刻充满泪
[02:16.837] 这个世界已不知不觉地空虚
[02:22.633] Wo 不想你别去
[02:28.159]
[02:57.258] 踏着灰色的轨迹
[03:03.907] 尽是深渊的水影
[03:10.177] 我已背上一身苦困后悔与唏嘘
[03:16.825] 你眼里却此刻充满泪
[03:23.523] 这个世界已不知不觉地空虚
[03:29.316] Wo 不想你别去
[03:36.879] 我已背上一身苦困后悔与唏嘘
[03:43.510] 你眼里却此刻充满泪
[03:50.195] 这个世界已不知不觉地空虚
[03:56.027] Wo 不想你别去
[04:01.971]
[05:19.986] 监制 : Beyond/欧阳燊`;

        // 光辉岁月的完整LRC歌词
        const gloryDaysLRC = `[00:00.000] 作词 : 黄家驹
[00:00.020] 作曲 : 黄家驹
[00:00.040] 编曲 : Beyond
[00:00.060] 制作人 : Beyond/Gordon O'Yang
[00:00.080]光辉岁月
[00:00.820]演唱：Beyond
[00:01.510]
[00:29.090]钟声响起归家的讯号
[00:33.650]在他生命里
[00:36.870]彷佛带点唏嘘
[00:42.100]黑色肌肤给他的意义
[00:46.580]是一生奉献 肤色斗争中
[00:55.130]年月把拥有变做失去
[01:01.560]疲倦的双眼带著期望
[01:07.960]今天只有残留的躯壳
[01:11.680]迎接光辉岁月
[01:14.980]风雨中抱紧自由
[01:21.010]一生经过彷徨的挣扎
[01:24.650]自信可改变未来
[01:27.840]问谁又能做到
[01:31.490]
[01:43.730]可否不分肤色的界线
[01:48.270]愿这土地里
[01:51.690]不分你我高低
[01:56.690]缤纷色彩显出的美丽
[02:01.180]是因它没有
[02:04.390]分开每种色彩
[02:09.680]年月把拥有变做失去
[02:16.180]疲倦的双眼带著期望
[02:22.590]今天只有残留的躯壳
[02:26.250]迎接光辉岁月
[02:29.480]风雨中抱紧自由
[02:35.630]一生经过彷徨的挣扎
[02:39.260]自信可改变未来
[02:42.460]问谁又能做到
[02:46.000]
[03:24.190]今天只有残留的躯壳
[03:27.780]迎接光辉岁月
[03:31.070]风雨中抱紧自由
[03:37.150]一生经过彷徨的挣扎
[03:40.790]自信可改变未来
[03:44.040]问谁又能做到
[03:47.540]
[03:59.900]今天只有残留的躯壳
[04:03.520]迎接光辉岁月
[04:06.720]风雨中抱紧自由
[04:12.770]一生经过彷徨的挣扎
[04:16.450]自信可改变未来
[04:19.650]问谁又能做到
[04:23.040]
[04:35.560]今天只有残留的躯壳
[04:39.130]迎接光辉岁月
[04:42.370]风雨中抱紧自由
[04:48.500]一生经过彷徨的挣扎
[04:52.120]自信可改变未来
[04:54.850]`;

        // 海阔天空的完整LRC歌词
        const boundlessSkyLRC = `[00:00.000] 作词 : 黄家驹
[00:01.000] 作曲 : 黄家驹
[00:02.000] 编曲 : Beyond/梁邦彦
[00:19.284] 今天我 寒夜里看雪飘过
[00:25.843] 怀着冷却了的心窝漂远方
[00:31.756] 风雨里追赶 雾里分不清影踪
[00:37.953] 天空海阔你与我
[00:41.014] 可会变 (谁没在变)
[00:44.166] 多少次 迎着冷眼与嘲笑
[00:50.788] 从没有放弃过心中的理想
[00:56.659] 一刹那恍惚 若有所失的感觉
[01:02.875] 不知不觉已变淡
[01:05.950] 心里爱 (谁明白我)
[01:09.534] 原谅我这一生不羁放纵爱自由
[01:16.536] 也会怕有一天会跌倒
[01:22.747] 背弃了理想 谁人都可以
[01:28.978] 哪会怕有一天只你共我
[01:35.178]
[01:43.460] 今天我 寒夜里看雪飘过
[01:50.028] 怀着冷却了的心窝漂远方
[01:55.883] 风雨里追赶 雾里分不清影踪
[02:02.166] 天空海阔你与我
[02:05.219] 可会变 (谁没在变)
[02:08.749] 原谅我这一生不羁放纵爱自由
[02:15.720] 也会怕有一天会跌倒
[02:21.978] 背弃了理想 谁人都可以
[02:28.219] 哪会怕有一天只你共我
[02:37.986] 仍然自由自我 永远高唱我歌
[02:44.612] 走遍千里
[02:49.228] 原谅我这一生不羁放纵爱自由
[02:56.296] 也会怕有一天会跌倒
[03:02.525] 背弃了理想 谁人都可以
[03:08.780] 哪会怕有一天只你共我
[03:14.224] 原谅我这一生不羁放纵爱自由
[03:21.263] 也会怕有一天会跌倒
[03:27.471] 背弃了理想 谁人都可以
[03:33.720] 哪会怕有一天只你共我
[03:40.096]`;

        // 真的爱你的完整LRC歌词
        const reallyLoveYouLRC = `[00:00.00] 作词 : 小美
[00:01.00] 作曲 : 黄家驹
[00:02.00] 编曲 : Beyond
[00:25.18]无法可修饰的一对手
[00:28.82]带出温暖永远在背后
[00:32.01]总是啰嗦始终关注
[00:33.99]不懂珍惜太内疚
[00:36.73]
[00:37.47]沉醉于音阶她不赞赏
[00:41.33]母亲的爱却永未退让
[00:44.48]决心冲开心中挣扎
[00:46.43]亲恩终可报答
[00:49.51]
[00:50.37]春风化雨暖透我的心
[00:53.45]一生眷顾无言地送赠
[00:57.04]
[00:58.10]是你多么温馨的目光
[01:01.59]教我坚毅望着前路
[01:04.74]叮嘱我跌倒不应放弃
[01:09.56]
[01:10.61]没法解释怎可报尽亲恩
[01:14.06]爱意宽大是无限
[01:17.19]请准我说声真的爱你
[01:21.99]
[01:35.28]无法可修饰的一对手
[01:38.96]带出温暖永远在背后
[01:42.09]总是罗嗦始终关注
[01:44.03]不懂珍惜太内疚
[01:46.94]
[01:47.56]仍记起温馨的一对手
[01:51.43]始终给我照顾未变样
[01:54.61]理想今天终于等到
[01:56.46]分享光辉盼做到
[01:59.78]
[02:00.39]春风化雨暖透我的心
[02:03.45]一生眷顾无言地送赠
[02:07.49]
[02:08.12]是你多么温馨的目光
[02:11.65]教我坚毅望着前路
[02:14.80]叮嘱我跌倒不应放弃
[02:19.71]
[02:20.68]没法解释怎可报尽亲恩
[02:24.09]爱意宽大是无限
[02:27.21]请准我说声真的爱你
[02:32.05]
[02:58.21]春风化雨暖透我的心
[03:01.13]一生眷顾无言地送赠
[03:04.21]
[03:05.80]是你多么温馨的目光
[03:09.26]教我坚毅望着前路
[03:12.41]叮嘱我跌倒不应放弃
[03:17.27]
[03:18.34]没法解释怎可报尽亲恩
[03:21.72]爱意宽大是无限
[03:24.83]请准我说声真的爱你
[03:29.26]
[03:30.79]是你多么温馨的目光（Woo……）
[03:34.16]教我坚毅望着前路
[03:37.31]叮嘱我跌倒不应放弃
[03:41.63]
[03:43.26]没法解释怎可报尽亲恩（Woo……）
[03:46.68]爱意宽大是无限
[03:49.80]请准我说声真的爱你`;

        // 喜欢你的完整LRC歌词
        const likeYouLRC = `[00:00.000] 作词 : 黄家驹
[00:00.666] 作曲 : 黄家驹
[00:01.332] 编曲 : Beyond
[00:02.000]编曲 : Beyond
[00:03.000]
[00:16.000]细雨带风湿透黄昏的街道
[00:21.574]
[00:22.263]抹去雨水双眼无故地仰望
[00:27.832]望向孤单的晚灯
[00:30.950]是那伤感的记忆
[00:34.673]
[00:38.014]再次泛起心里无数的思念
[00:43.605]
[00:44.261]以往片刻欢笑仍挂在脸上
[00:49.755]愿你此刻可会知
[00:53.006]是我衷心的说声
[00:56.575]
[00:58.470]喜欢你 那双眼动人
[01:04.594]笑声更迷人
[01:07.902]愿再可 轻抚你
[01:14.046]那可爱面容
[01:17.234]挽手说梦话
[01:20.442]像昨天 你共我
[01:27.595]
[01:34.626]满带理想的我曾经多冲动
[01:40.050]
[01:40.780]你怨与他相爱难有自由
[01:46.272]愿你此刻可会知
[01:49.381]是我衷心的说声
[01:52.995]
[01:54.902]喜欢你 那双眼动人
[02:01.157]笑声更迷人
[02:04.421]愿再可 轻抚你
[02:10.587]那可爱面容
[02:13.685]挽手说梦话
[02:16.850]像昨天 你共我
[02:24.330]
[02:47.327]每晚夜里自我独行
[02:51.287]随处荡 多冰冷
[02:57.566]
[02:59.925]以往为了自我挣扎
[03:03.744]从不知 她的痛苦
[03:11.781]
[03:13.245]喜欢你 那双眼动人
[03:19.518]笑声更迷人
[03:22.724]愿再可 轻抚你
[03:28.923]那可爱面容
[03:32.058]挽手说梦话
[03:35.133]像昨天 你共我
[03:41.459]Shi be do ho ho
[03:44.623]Shi be do ho ho
[03:47.830]Shi be do ho ho
[03:50.977]
[03:54.073]Shi be do ho ho
[03:57.131]Shi be do ho ho
[04:00.279]Shi be do ho ho
[04:03.512]
[04:06.546]Shi be do ho ho
[04:09.673]Shi be do ho ho
[04:12.820]Shi be do ho ho
[04:15.997]
[04:19.104]Shi be do ho ho
[04:22.295]Shi be do ho ho
[04:25.457]Shi be do ho ho
[04:29.358]`;
        
        // 播放列表数据 - 添加完整的封面图和歌词URL
        const playlistData = [
            {
                id: 1,
                title: "灰色轨迹",
                artist: "BEYOND",
                duration: "05:23",
                src: "https://music.163.com/song/media/outer/url?id=2756253481.mp3",
                album: "天若有情 电影原声",
                year: "1990",
                cover: "http://p1.music.126.net/K_p-jhEvCpP7I4Sqd_QfFw==/7954966627607511.jpg",
                lyrics: parseLRC(greyTrackLRC) // 使用解析后的LRC歌词
            },
            {
                id: 2,
                title: "海阔天空",
                artist: "BEYOND",
                duration: "05:10",
                src: "https://music.163.com/song/media/outer/url?id=1357374736.mp3",
                album: "乐与怒",
                year: "1993",
                cover: "http://p1.music.126.net/qnQ93WnZHACVvIM14c4sAQ==/109951163984007061.jpg",
                lyrics: parseLRC(boundlessSkyLRC) // 使用完整的海阔天空歌词
            },
            {
                id: 3,
                title: "光辉岁月",
                artist: "BEYOND",
                duration: "05:05",
                src: "https://music.163.com/song/media/outer/url?id=2756253484.mp3",
                album: "命运派对",
                year: "1990",
                cover: "http://p1.music.126.net/JOJvZc_7SqQjKf8TktQ_bw==/29686813951246.jpg",
                lyrics: parseLRC(gloryDaysLRC) // 使用完整的光辉岁月歌词
            },
            {
                id: 4,
                title: "真的爱你",
                artist: "BEYOND",
                duration: "04:38",
                src: "https://music.163.com/song/media/outer/url?id=469391955.mp3",
                album: "BEYOND IV",
                year: "1989",
                cover: "http://p2.music.126.net/8OnQEurR2R2cApyYu7FBhQ==/109951169261306287.jpg",
                lyrics: parseLRC(reallyLoveYouLRC) // 使用完整的真的爱你歌词
            },
            {
                id: 5,
                title: "喜欢你",
                artist: "BEYOND",
                duration: "04:30",
                src: "https://music.163.com/song/media/outer/url?id=346163.mp3",
                album: "秘密警察",
                year: "1988",
                cover: "http://p2.music.126.net/h5XXOuri1-E-OtpE2L-4sg==/1781208837010258.jpg",
                lyrics: parseLRC(likeYouLRC) // 使用完整的喜欢你歌词
            }
        ];
        
        // 初始化播放列表
        function initPlaylist() {
            playlistContainer.innerHTML = '';
            
            playlistData.forEach((song, index) => {
                const playlistItem = document.createElement('div');
                playlistItem.className = `playlist-item ${index === currentSongIndex ? 'active' : ''}`;
                playlistItem.dataset.index = index;
                
                playlistItem.innerHTML = `
                    <div class="playlist-item-number">${index + 1}</div>
                    <div class="playlist-item-info">
                        <div class="playlist-item-title">${song.title}</div>
                        <div class="playlist-item-artist">${song.artist}</div>
                    </div>
                    <div class="playlist-item-duration">${song.duration}</div>
                `;
                
                playlistItem.addEventListener('click', () => {
                    playSong(index);
                });
                
                playlistContainer.appendChild(playlistItem);
            });
        }
        
        // 更新播放模式显示
        function updatePlayMode() {
            modeIcon.className = `fas ${playModes[playMode].icon}`;
            modeControl.title = playModes[playMode].text;
        }
        
        // 播放模式切换
        modeControl.addEventListener('click', function() {
            playMode = (playMode + 1) % playModes.length;
            updatePlayMode();
        });
        
        // 切换歌词显示
        function toggleLyrics() {
            showLyrics = !showLyrics;
            
            if (showLyrics) {
                coverSection.classList.add('show-lyrics');
                lyricsBtn.classList.add('active');
                lyricsBtn.title = '隐藏歌词';
                updateLyricsDisplay();
            } else {
                coverSection.classList.remove('show-lyrics');
                lyricsBtn.classList.remove('active');
                lyricsBtn.title = '显示歌词';
            }
        }
        
        // 歌词按钮点击事件
        lyricsBtn.addEventListener('click', toggleLyrics);
        
        // 播放指定歌曲
        function playSong(index) {
            if (index < 0 || index >= playlistData.length) return;
            
            // 如果正在播放的是同一首歌，直接返回
            if (currentSongIndex === index && audioPlayer.src === playlistData[index].src && audioPlayer.src) {
                // 如果是同一首歌，直接播放/暂停
                if (!isPlaying) {
                    audioPlayer.play().then(() => {
                        isPlaying = true;
                        playIcon.classList.remove('fa-play');
                        playIcon.classList.add('fa-pause');
                    }).catch(e => {
                        console.log('播放失败:', e);
                    });
                }
                return;
            }
            
            // 更新当前歌曲索引
            currentSongIndex = index;
            const song = playlistData[currentSongIndex];
            
            // 更新UI
            updateSongInfo(song);
            
            // 更新播放列表高亮
            document.querySelectorAll('.playlist-item').forEach((item, i) => {
                if (i === currentSongIndex) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
            
            // 加载音乐
            loadAndPlaySong(song.src);
            
            // 更新歌词
            updateLyrics(song.lyrics);
            
            // 如果是暂停状态，加载后不播放
            if (!isPlaying) {
                audioPlayer.pause();
                playIcon.classList.remove('fa-pause');
                playIcon.classList.add('fa-play');
            }
        }
        
        // 更新歌曲信息
        function updateSongInfo(song) {
            // 更新标题和艺术家
            songTitle.textContent = song.title;
            songArtist.textContent = song.artist;
            
            // 更新备用封面显示
            fallbackTitle.textContent = song.title;
            fallbackArtist.textContent = song.artist;
            
            // 更新专辑信息
            albumInfo.innerHTML = `
                <p><i class="fas fa-music"></i> ${song.album} · ${song.year}年发行</p>
                <p><i class="fas fa-clock"></i> 时长：${song.duration}</p>
                <p><i class="fas fa-compact-disc"></i> 专辑：${song.album}</p>
                <p><i class="fas fa-star"></i> ${song.artist}</p>
            `;
            
            // 更新总时长显示
            totalTimeDisplay.textContent = song.duration;
            
            // 解析时长字符串为秒数
            const timeParts = song.duration.split(':');
            if (timeParts.length === 2) {
                const minutes = parseInt(timeParts[0]);
                const seconds = parseInt(timeParts[1]);
                totalTime = minutes * 60 + seconds;
            }
            
            // 更新封面图
            updateCoverImage(song.cover);
            
            // 重置进度
            currentTime = 0;
            updateProgress();
        }
        
        // 更新封面图
        function updateCoverImage(coverUrl) {
            if (coverUrl) {
                coverImage.src = coverUrl;
                coverImage.onload = function() {
                    coverImage.style.display = 'block';
                    coverFallback.style.display = 'none';
                };
                coverImage.onerror = function() {
                    coverImage.style.display = 'none';
                    coverFallback.style.display = 'flex';
                };
            } else {
                coverImage.style.display = 'none';
                coverFallback.style.display = 'flex';
            }
        }
        
        // 更新歌词数据
        function updateLyrics(lyrics) {
            currentLyrics = lyrics || [];
            updateLyricsDisplay();
        }
        
        // 更新歌词显示
        function updateLyricsDisplay() {
            lyricsDisplay.innerHTML = '';
            
            if (currentLyrics.length === 0) {
                const noLyrics = document.createElement('div');
                noLyrics.className = 'lyric-line';
                noLyrics.textContent = '暂无歌词';
                lyricsDisplay.appendChild(noLyrics);
                return;
            }
            
            currentLyrics.forEach((lyric) => {
                const lyricLine = document.createElement('div');
                lyricLine.className = 'lyric-line';
                lyricLine.dataset.time = lyric.time;
                lyricLine.textContent = lyric.text;
                lyricsDisplay.appendChild(lyricLine);
            });
        }
        
        // 更新当前歌词高亮
        function updateCurrentLyric() {
            const lyricLines = document.querySelectorAll('.lyric-line');
            let currentIndex = -1;
            
            // 找到当前时间对应的歌词行
            for (let i = 0; i < currentLyrics.length; i++) {
                if (currentTime >= currentLyrics[i].time) {
                    currentIndex = i;
                } else {
                    break;
                }
            }
            
            // 更新歌词高亮
            lyricLines.forEach((line, index) => {
                if (index === currentIndex) {
                    line.classList.add('active');
                    // 滚动到当前歌词位置
                    if (showLyrics) {
                        line.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                } else {
                    line.classList.remove('active');
                }
            });
        }
        
        // 加载并播放音乐
        function loadAndPlaySong(src) {
            // 如果正在播放同一首歌，直接返回
            if (audioPlayer.src === src && audioPlayer.src) {
                return;
            }
            
            // 显示加载提示
            loadingIndicator.classList.add('active');
            
            // 设置音频源
            audioPlayer.src = src;
            
            // 尝试播放
            audioPlayer.load();
            
            // 监听音频加载完成
            audioPlayer.addEventListener('canplaythrough', function onCanPlay() {
                // 隐藏加载提示
                loadingIndicator.classList.remove('active');
                
                // 移除事件监听器，避免重复触发
                audioPlayer.removeEventListener('canplaythrough', onCanPlay);
                
                // 如果正在播放状态，则播放
                if (isPlaying) {
                    audioPlayer.play().catch(e => {
                        console.log('自动播放被阻止，需要用户交互');
                        // 如果自动播放失败，设置播放状态为false
                        isPlaying = false;
                        playIcon.classList.remove('fa-pause');
                        playIcon.classList.add('fa-play');
                    });
                }
            });
            
            // 监听音频加载错误
            audioPlayer.addEventListener('error', function onError() {
                loadingIndicator.classList.remove('active');
                console.log('加载音乐失败:', src);
                // 不弹出alert，避免干扰用户
                audioPlayer.removeEventListener('error', onError);
            });
            
            // 监听音频时间更新
            //audioPlayer.addEventListener('timeupdate', updateAudioTime);
            
            // 监听音频播放结束
            //audioPlayer.addEventListener('ended', handleSongEnded);
        }
        
        // 处理歌曲结束
        function handleSongEnded() {
            // 只有当当前正在播放时才自动切换到下一首
            if (isPlaying) {
                // 根据播放模式选择下一首歌
                let nextIndex = currentSongIndex;
                
                if (playMode === 0) { // 列表循环
                    nextIndex = (currentSongIndex + 1) % playlistData.length;
                } else if (playMode === 1) { // 随机播放
                    nextIndex = Math.floor(Math.random() * playlistData.length);
                } else if (playMode === 2) { // 单曲循环
                    // 重新播放当前歌曲
                    audioPlayer.currentTime = 0;
                    audioPlayer.play();
                    return;
                }
                
                playSong(nextIndex);
                // 确保继续播放
                audioPlayer.play();
            }
            // 如果 isPlaying 为 false（暂停状态），则不自动播放下一首
        }
        
        // 更新音频时间
        function updateAudioTime() {
            currentTime = audioPlayer.currentTime;
            updateProgress();
            updateCurrentLyric();
        }
        
        // 初始化音量
        function updateVolume() {
            volumeSlider.style.width = `${currentVolume * 100}%`;
            volumeHandle.style.left = `${currentVolume * 100}%`;
            audioPlayer.volume = currentVolume;
            
            // 更新音量图标
            if (currentVolume === 0) {
                volumeIcon.className = 'fas fa-volume-mute';
            } else if (currentVolume < 0.5) {
                volumeIcon.className = 'fas fa-volume-down';
            } else {
                volumeIcon.className = 'fas fa-volume-up';
            }
        }
        
        // 初始化音量
        updateVolume();
        
        // 更新进度显示
        function updateProgress() {
            const progressPercent = (currentTime / totalTime) * 100;
            progressBar.style.width = `${progressPercent}%`;
            progressHandle.style.left = `${progressPercent}%`;
            
            // 更新时间显示
            const minutes = Math.floor(currentTime / 60);
            const seconds = Math.floor(currentTime % 60);
            currentTimeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        // 初始化进度
        updateProgress();
        
        // 播放/暂停功能 - 修复：确保正确处理播放状态
        playBtn.addEventListener('click', function() {
            // 如果音频已经有源且已加载
            if (audioPlayer.src && audioPlayer.readyState >= 2) {
                // 如果正在播放，暂停
                if (isPlaying) {
                    audioPlayer.pause();
                    playIcon.classList.remove('fa-pause');
                    playIcon.classList.add('fa-play');
                    isPlaying = false;
                } else {
                    // 如果暂停，继续播放
                    audioPlayer.play().then(() => {
                        playIcon.classList.remove('fa-play');
                        playIcon.classList.add('fa-pause');
                        isPlaying = true;
                    }).catch(e => {
                        console.log('播放失败:', e);
                        // 如果自动播放失败，尝试重新加载
                        if (audioPlayer.src) {
                            audioPlayer.load();
                            audioPlayer.play().then(() => {
                                playIcon.classList.remove('fa-play');
                                playIcon.classList.add('fa-pause');
                                isPlaying = true;
                            }).catch(err => {
                                console.log('重新播放失败:', err);
                            });
                        }
                    });
                }
            } else {
                // 如果音频未加载或没有源，加载当前歌曲并播放
                isPlaying = true;
                playIcon.classList.remove('fa-play');
                playIcon.classList.add('fa-pause');
                playSong(currentSongIndex);
            }
        });
        
        // 点击进度条跳转
        document.querySelector('.progress-bar').addEventListener('click', function(e) {
            if (!audioPlayer.src) return;
            
            const progressBarWidth = this.offsetWidth;
            const clickPosition = e.offsetX;
            const newTime = (clickPosition / progressBarWidth) * totalTime;
            
            currentTime = newTime;
            audioPlayer.currentTime = currentTime;
            updateProgress();
        });
        
        // 拖拽进度手柄
        progressHandle.addEventListener('mousedown', function(e) {
            if (!audioPlayer.src) return;
            
            e.preventDefault();
            const progressBar = document.querySelector('.progress-bar');
            const progressBarRect = progressBar.getBoundingClientRect();
            
            function moveHandler(moveEvent) {
                const offsetX = moveEvent.clientX - progressBarRect.left;
                const percentage = Math.max(0, Math.min(1, offsetX / progressBarRect.width));
                
                currentTime = percentage * totalTime;
                audioPlayer.currentTime = currentTime;
                updateProgress();
            }
            
            function upHandler() {
                document.removeEventListener('mousemove', moveHandler);
                document.removeEventListener('mouseup', upHandler);
            }
            
            document.addEventListener('mousemove', moveHandler);
            document.addEventListener('mouseup', upHandler);
        });
        
        // 音量控制功能
        function setVolumeFromClick(e) {
            const containerRect = volumeSliderContainer.getBoundingClientRect();
            const offsetX = e.clientX - containerRect.left;
            const percentage = Math.max(0, Math.min(1, offsetX / containerRect.width));
            
            currentVolume = percentage;
            updateVolume();
        }
        
        volumeSliderContainer.addEventListener('click', setVolumeFromClick);
        
        // 拖拽音量手柄
        volumeHandle.addEventListener('mousedown', function(e) {
            e.preventDefault();
            const containerRect = volumeSliderContainer.getBoundingClientRect();
            
            function moveHandler(moveEvent) {
                const offsetX = moveEvent.clientX - containerRect.left;
                const percentage = Math.max(0, Math.min(1, offsetX / containerRect.width));
                
                currentVolume = percentage;
                updateVolume();
            }
            
            function upHandler() {
                document.removeEventListener('mousemove', moveHandler);
                document.removeEventListener('mouseup', upHandler);
            }
            
            document.addEventListener('mousemove', moveHandler);
            document.addEventListener('mouseup', upHandler);
        });
        
        // 倍速控制功能
        function updateSpeed() {
            speedDisplay.textContent = `${currentSpeed.toFixed(1)}X`;
            audioPlayer.playbackRate = currentSpeed;
        }
        
        // 降低速度
        speedDownBtn.addEventListener('click', function() {
            if (currentSpeed > 0.5) {
                currentSpeed -= 0.25;
                updateSpeed();
            }
        });
        
        // 提高速度
        speedUpBtn.addEventListener('click', function() {
            if (currentSpeed < 2.0) {
                currentSpeed += 0.25;
                updateSpeed();
            }
        });
        
        // 上一曲功能
        document.querySelectorAll('.control-btn')[1].addEventListener('click', function() {
            if (playMode === 1) { // 随机播放模式
                let randomIndex;
                do {
                    randomIndex = Math.floor(Math.random() * playlistData.length);
                } while (randomIndex === currentSongIndex && playlistData.length > 1);
                playSong(randomIndex);
            } else {
                if (currentSongIndex > 0) {
                    playSong(currentSongIndex - 1);
                } else {
                    playSong(playlistData.length - 1); // 循环到最后一首
                }
            }
        });
        
        // 下一曲功能
        document.querySelectorAll('.control-btn')[2].addEventListener('click', function() {
            if (playMode === 1) { // 随机播放模式
                let randomIndex;
                do {
                    randomIndex = Math.floor(Math.random() * playlistData.length);
                } while (randomIndex === currentSongIndex && playlistData.length > 1);
                playSong(randomIndex);
            } else {
                if (currentSongIndex < playlistData.length - 1) {
                    playSong(currentSongIndex + 1);
                } else {
                    playSong(0); // 循环到第一首
                }
            }
        });
        
        // 音乐列表按钮功能
        playlistBtn.addEventListener('click', function() {
            playlistPanel.classList.add('active');
        });
        
        // 关闭音乐列表
        closePlaylistBtn.addEventListener('click', function() {
            playlistPanel.classList.remove('active');
        });
        
        // 点击列表外区域关闭音乐列表
        document.addEventListener('click', function(e) {
            if (playlistPanel.classList.contains('active') && 
                !playlistPanel.contains(e.target) && 
                e.target !== playlistBtn && 
                !playlistBtn.contains(e.target)) {
                playlistPanel.classList.remove('active');
            }
        });
        
        // 全屏功能
        fullscreenBtn.addEventListener('click', function() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.log(`全屏请求失败: ${err.message}`);
                });
                fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
                fullscreenBtn.title = '退出全屏';
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                    fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
                    fullscreenBtn.title = '切换全屏';
                }
            }
        });
        
        // 监听全屏变化
        document.addEventListener('fullscreenchange', function() {
            if (!document.fullscreenElement) {
                fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
                fullscreenBtn.title = '切换全屏';
            }
        });
        
        // ESC键退出全屏时更新按钮状态
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && document.fullscreenElement) {
                fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
                fullscreenBtn.title = '切换全屏';
            }
        });
        
        // 初始化播放器
        initPlaylist();
        updatePlayMode();
        // 预加载第一首歌曲但不自动播放
        playSong(currentSongIndex);
        
        // 当页面首次加载时，只加载但不播放
        isPlaying = false;
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
        
        // 初始化歌词按钮状态
        lyricsBtn.title = '显示歌词';
    });


(function(){
  const audio = document.querySelector('audio');
  if(!audio) return;

  // 防止 ended 被重复绑定
  audio.onended = function(){
    if (typeof nextSong === 'function') nextSong();
  };

  const playBtn = document.querySelector('.play-btn, #play, .btn-play');
  if(playBtn){
    playBtn.onclick = function(){
      audio.paused ? audio.play() : audio.pause();
    }
  }
})();
