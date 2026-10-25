import { Component } from '@angular/core';

interface ArticleOfFaith {
  number: string;
  title: string;
  text: string;
  references: string;
}

@Component({
  selector: 'app-beliefs',
  standalone: true,
  templateUrl: './beliefs.html',
  styleUrl: './beliefs.css'
})
export class Beliefs {
  readonly articles: ArticleOfFaith[] = [
    {
      number: 'I',
      title: 'The Holy Scriptures',
      text: 'We believe that the Holy Scriptures, comprising the Old and New Testaments, are the inspired Word of God, given by divine inspiration and wholly trustworthy in all that they affirm. They are the supreme and final authority for Christian faith, doctrine, and practice, sufficient to equip the people of God for every good work. Scripture must be interpreted faithfully according to its context and in harmony with the whole counsel of God. No human tradition, personal experience, philosophical speculation, or ecclesiastical authority may supersede the authority of God’s written Word.',
      references: '2 Timothy 3:16–17; Psalm 19:7–11; 2 Peter 1:20–21; Acts 17:11'
    },
    {
      number: 'II',
      title: 'The Nature and Being of God',
      text: 'We believe in one living and true God, eternal, infinite, sovereign, holy, righteous, wise, and unchanging in His being and perfections. God is the Creator, Sustainer, and Governor of all things and is worthy of all worship, obedience, and glory. God eternally exists in three distinct Persons—the Father, the Son, and the Holy Spirit—who are coequal in deity, glory, and majesty, sharing the one undivided divine essence. His sovereignty does not make Him the author of sin or absolve human beings of responsibility for their actions.',
      references: 'Deuteronomy 6:4; Matthew 28:19; Isaiah 46:9–11; Acts 5:3–4; Ephesians 1:11; James 1:13–17'
    },
    {
      number: 'III',
      title: 'The Person and Work of Jesus Christ',
      text: 'We believe that Jesus Christ is the eternal Son of God, truly God and truly man, conceived by the Holy Spirit and born of the Virgin Mary. He possesses two distinct and complete natures, divine and human, united in one Person without confusion, change, division, or separation. He lived in perfect obedience to the Father, died on the cross for the sins of His people, was bodily raised from the dead, ascended into heaven, and reigns at the Father’s right hand. He alone is the Mediator between God and humanity, and He will return bodily in glory to judge the living and the dead.',
      references: 'John 1:1–14; Philippians 2:5–11; Colossians 2:9; 1 Timothy 2:5–6; 1 Corinthians 15:3–8; Acts 1:9–11'
    },
    {
      number: 'IV',
      title: 'Humanity, the Fall, and Sin',
      text: 'We believe that God created humanity in His image, male and female, to glorify Him and live in fellowship with Him. Through Adam’s disobedience, sin entered the world, bringing condemnation, corruption, and death. Humanity, being fallen in Adam, is sinful by nature and by practice and is unable to reconcile itself to God through its own wisdom, righteousness, religious observances, or good works. Every human being remains accountable to God, and salvation is necessary for all.',
      references: 'Genesis 1:26–28; Genesis 3:1–19; Romans 3:9–23; Romans 5:12–21; Ephesians 2:1–3'
    },
    {
      number: 'V',
      title: 'Salvation by Grace Through Faith in Christ',
      text: 'We believe that salvation is wholly of God’s grace and is accomplished through the person and work of Jesus Christ. According to His eternal purpose, God graciously elects a people for Himself, and through the proclamation of the gospel and the work of the Holy Spirit, sinners are brought to repentance and faith in Christ. We are justified by grace alone, through faith alone, on account of Christ alone, apart from works of the law. Salvation is God’s work from beginning to end, and all glory belongs to Him.',
      references: 'John 6:37–40; Romans 3:21–28; Romans 8:29–30; Ephesians 1:3–14; Ephesians 2:8–10; Titus 3:4–7'
    },
    {
      number: 'VI',
      title: 'The Holy Spirit and Sanctification',
      text: 'We believe that the Holy Spirit is the third Person of the Trinity, fully divine and equal with the Father and the Son. He convicts the world concerning sin, righteousness, and judgment; regenerates sinners; indwells believers; illuminates the Scriptures; and empowers God’s people for faithful witness and service. All who belong to Christ are called to progressive sanctification, increasingly conformed to the image of Christ by the Spirit and the Word of God.',
      references: 'John 3:5–8; John 16:7–14; Romans 8:9–14; Galatians 5:16–25; Ephesians 2:10; 1 Peter 1:14–16'
    },
    {
      number: 'VII',
      title: 'The Church and the Great Commission',
      text: 'We believe that the universal church consists of all those who have been redeemed by Christ and united to Him by faith. Local churches are called to gather for worship, the teaching of Scripture, prayer, fellowship, mutual edification, and Christian service. The church is entrusted with the proclamation of the gospel and the making of disciples among all nations. Every believer is called to serve Christ according to the gifts and opportunities God provides.',
      references: 'Matthew 28:18–20; Acts 2:42–47; Acts 1:8; Ephesians 4:11–16; 1 Peter 4:10–11'
    },
    {
      number: 'VIII',
      title: 'The Christian Life, Holiness, and Good Works',
      text: 'We believe that those who have been saved by grace are called to live in grateful obedience to God, walking in holiness, love, humility, and good works. Good works neither earn salvation nor establish a righteousness independent of Christ; rather, they are the fruit of God’s gracious work in His people and the appointed expression of living faith. Christians are called to resist sin, love their neighbours, serve faithfully, and bear witness to the transforming power of the gospel.',
      references: 'Romans 12:1–2; 1 Corinthians 10:31; Ephesians 2:8–10; Titus 2:11–14; Titus 3:8; James 2:14–26'
    },
    {
      number: 'IX',
      title: 'The Return of Christ, Resurrection, and Eternal Judgment',
      text: 'We believe that the Lord Jesus Christ will return bodily and visibly in glory at the time appointed by the Father. The dead will be raised, and all humanity will stand before the judgment of God. Those who belong to Christ will enter into the fullness of eternal life, enjoying the presence of God in the new heavens and the new earth, while those who remain in their sins will face the righteous judgment of God. This hope calls believers to perseverance, watchfulness, godliness, and faithful service as they await the appearing of their Lord.',
      references: 'John 5:25–29; Acts 17:30–31; 1 Corinthians 15:20–28, 51–57; 2 Corinthians 5:10; Revelation 20:11–15; Revelation 21:1–4'
    }
  ];
}
