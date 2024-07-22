import React from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

export default function About() {
  return (
    <div className="py-20 px-4 max-w-6xl mx-auto">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gray-800 opacity-50"></div>
        <div className="relative text-center text-white py-12 px-4">
          <h1
            className="text-4xl font-bold mb-4"
            style={{ color: "#00B98E" }}
          >
            За Bozhidar Estate
          </h1>
          <p className="text-xl mb-8">
            Вашият надежден партньор в света на недвижимите имоти
          </p>
          <a
            href="/contact"
            className="inline-block bg-teal-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-teal-600"
          >
            Свържете се с нас
          </a>
        </div>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-white">Нашата Мисия</h2>
        <p className="mb-4 text-white">
          Агенция "Bozhidar Estate" е водеща агенция за недвижими имоти,
          специализирана в помощта на клиенти при покупка и продажба на имоти в
          най-желаните квартали. Нашият екип от опитни агенти е отдаден на
          предоставянето на изключително обслужване и прави процеса на покупка и
          продажба възможно най-гладък.
        </p>
        <p className="mb-4 text-white">
          Нашата мисия е да помогнем на клиентите си да постигнат своите цели в
          сферата на недвижимите имоти, като предоставяме експертни съвети,
          персонализирано обслужване и дълбоко разбиране на местния пазар.
          Независимо дали търсите да купите или продадете имот, ние сме тук да
          ви помогнем на всяка стъпка от пътя.
        </p>
        <p className="mb-4 text-white">
          Нашият екип от агенти разполага с богат опит и знания в индустрията на
          недвижимите имоти, и сме ангажирани да предоставяме най-високото ниво
          на обслужване на нашите клиенти. Вярваме, че покупката или продажбата
          на имот трябва да бъде вълнуващо и възнаграждаващо преживяване, и сме
          посветени на това да го направим реалност за всеки един от нашите
          клиенти.
        </p>
      </div>
    </div>
  );
}
