export default function PrivacyPage() {
  return (
    <div className="section pt-32">
      <div className="container max-w-4xl">
        <h1 className="text-gray-900 mb-8">Политика конфиденциальности</h1>
        
        <div className="prose prose-lg max-w-none text-gray-600">
          <p className="lead text-xl mb-8">
            Настоящая Политика конфиденциальности определяет порядок обработки персональных данных 
            и меры по обеспечению безопасности персональных данных в ООО «Аутсорсинг Системз» (RUBOLKA).
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Общие положения</h2>
          <p>
            1.1. Действие настоящей Политики распространяется на все процессы по сбору, записи, 
            систематизации, накоплению, хранению, уточнению, извлечению, использованию, передаче, 
            обезличиванию, блокированию, удалению, уничтожению персональных данных.
          </p>
          <p>
            1.2. Настоящая Политика применима ко всем сайтам, принадлежащим ООО «Аутсорсинг Системз».
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Цели обработки персональных данных</h2>
          <p>
            2.1. Обработка персональных данных осуществляется в следующих целях:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Обработка заказов и доставка товаров</li>
            <li>Информирование о статусе заказа</li>
            <li>Консультирование по вопросам приобретения товаров</li>
            <li>Улучшение качества обслуживания клиентов</li>
            <li>Проведение маркетинговых исследований</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Перечень обрабатываемых персональных данных</h2>
          <p>
            3.1. В рамках настоящей Политики обрабатываются следующие персональные данные:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Фамилия, имя, отчество</li>
            <li>Номер телефона</li>
            <li>Адрес электронной почты</li>
            <li>Адрес доставки</li>
            <li>История заказов</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Правовые основания обработки</h2>
          <p>
            4.1. Правовыми основаниями обработки персональных данных являются:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Договоры, заключаемые между оператором и субъектом персональных данных</li>
            <li>Федеральный закон от 27.07.2006 N 152-ФЗ «О персональных данных»</li>
            <li>Согласие субъектов персональных данных на обработку их персональных данных</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Порядок и условия обработки</h2>
          <p>
            5.1. Обработка персональных данных осуществляется с соблюдением принципов и правил, 
            установленных Федеральным законом «О персональных данных».
          </p>
          <p>
            5.2. Персональные данные обрабатываются как с использованием средств автоматизации, 
            так и без использования таких средств.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Защита персональных данных</h2>
          <p>
            6.1. Оператор принимает необходимые правовые, организационные и технические меры 
            для защиты персональных данных от неправомерного или случайного доступа к ним.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Права субъектов персональных данных</h2>
          <p>
            7.1. Субъект персональных данных имеет право:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Получать информацию об обработке его персональных данных</li>
            <li>Требовать уточнения, блокирования или уничтожения персональных данных</li>
            <li>Отозвать согласие на обработку персональных данных</li>
            <li>Обжаловать действия или бездействие оператора</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Контактная информация</h2>
          <p>
            По вопросам, касающимся обработки персональных данных, можно обращаться:
          </p>
          <ul className="list-none space-y-2 mt-4">
            <li><strong>Email:</strong> privacy@rubolka.ru</li>
            <li><strong>Телефон:</strong> +7 (999) 123-45-67</li>
            <li><strong>Адрес:</strong> г. Москва, ул. Производственная, д. 15</li>
          </ul>

          <div className="border-t border-gray-200 mt-12 pt-8">
            <p className="text-sm text-gray-500">
              Дата последнего обновления: 15 января 2025 г.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 