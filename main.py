#!/usr/bin/env python

"""
Un robot Telegram pour jouer au jeu du nombre mystère
"""

import logging
import os
from random import randint
from dotenv import load_dotenv
from telegram.ext import Updater, CommandHandler, MessageHandler, Filters

# Chargement de la variable d'environemment TOKEN_BOT du fichir .env
load_dotenv()

# Activation du logging
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

# La commande de base pour discuter avec le robot
# Elle sert également pour lancer une partie
def start(update, context):
    """Envoyer le message de démarrage quand la commande /start est exécutée."""

    # Sauvegarde du nombre mystère dans un fichier
    fichier = open(f"{update.message.chat.id}.txt", "w")
    fichier.write(str(randint(1, 100)))
    fichier.close()
    update.message.reply_markdown('Quel est le *nombre mystère* ? \n\nIl est compris entre 1 et 100.')


def echo(update, context):
    """Gestion du message saisi par un joueur."""

    # Récupération du message saisi par le joueur
    proposition = update.message.text

    if proposition.isdigit():

        # Récupération du nombre mystère
        fichier = open(f"{update.message.chat.id}.txt", "r")
        nombre_mystere = int(fichier.read())
        fichier.close()

        if nombre_mystere > int(proposition):
            update.message.reply_markdown(f"Le nombre mystère est supérieur à *{proposition}*")
        elif nombre_mystere < int(proposition):
            update.message.reply_markdown(f"Le nombre mystère est inférieur à *{proposition}*")
        else:
            if update.message.chat.type == "group":
                update.message.reply_markdown(f"*{update.message.from_user.first_name}* a trouvé le nombre mystère. C'était *{nombre_mystere}*")
            else:
                update.message.reply_markdown(f"Bravo! Vous avez trouvé le nombre mystère. C'était *{nombre_mystere}*")


def error(update, context):
    """Gestion des erreurs."""
    logger.warning('Update "%s" \ncaused error "%s"', update, context.error)


def main():
    """Démarrage du robot."""

    TOKEN_BOT = os.getenv('TOKEN_BOT')

    updater = Updater(TOKEN_BOT, use_context=True)

    # Récupération du dispatcher
    dp = updater.dispatcher

    # Différentes commandes liées au robot
    dp.add_handler(CommandHandler("start", start))

    # Gestion des messages reçus de Telegram
    dp.add_handler(MessageHandler(Filters.text, echo))

    # Gestion des erreurs
    dp.add_error_handler(error)

    # Démarrage du robot
    updater.start_polling()

    # Gestion de l'intérruption du programme
    updater.idle()


if __name__ == '__main__':
    main()